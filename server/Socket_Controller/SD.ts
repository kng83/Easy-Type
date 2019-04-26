import WebSocket from 'ws';
import { tryFnRun, ErrPassingObj, checkAgainstUndefined } from './utilities/src/error_handling/error_handling';
import { PayloadWrapper, SCMessage, Payload } from './socket_analyzer';




//TODO make better
//***Socket Demultiplexer */
export class CreateMapper<K> {

    //**Create singleton instance */
    public static mountMappingArr<T>(dataArr: T[]) {
        return new CreateMapper(dataArr) as Pick<CreateMapper<T>, 'setDataArrPrimaryKey'>;
    }

    //**Private variables */
    private mapObj: Map<string, K>;
    private _primaryKey: string;
    private constructor(private readonly _objArr: K[]) { }

    //**Map object to primary key. Primary key is used for router powered by Map key value pairs*/
    public setDataArrPrimaryKey(primaryObjKey: string) {
        this._primaryKey = primaryObjKey;
        return this as any as Pick<CreateMapper<K>, 'createMapperObj'>;
    }

    //**Append map key to Instance object. This key will hold converted Mapping Array */
    public createMapperObj() {
        this.mapObj = new Map<string, K>();
        this._objArr.forEach(el => {
            this.mapObj.set(el[this._primaryKey], el);
        });
        return this.mapObj;
    }

    // public mountPayloadObj<T,K>(payloadObj: Payload<T,K>) {
    //     //Make copy of payloadObj and replace old property content with new content;
    //     const payload = {...payloadObj};
    //     payload.mapper = this.mapper;
    //     return payload;
    // }
}



export class MessageResolver<T,K>{
    //**Bind function which returns [message,mappingElement] */

    public static mountPayload<T,K>(payloadObj: Payload<T,K>) {
        return new MessageResolver(payloadObj) as Pick<MessageResolver<T,K>, 'mountMapObj'>;
    }

    private _primaryKey: string;
    private _payloadObj: Payload<T,K>;
    private _mapObj = undefined;

    private constructor(payloadObj: Payload<T,K>) {
        this._payloadObj = payloadObj;
    }

    public mountMapObj<M>(mapObj:M){
        this._mapObj = mapObj;
        return this as Pick<MessageResolver<T,K>, 'chooseMessageRoutingKey'>;
    }


    //**Primary key for messages */
    public chooseMessageRoutingKey(primaryMessageKey: string) {
        this._primaryKey = primaryMessageKey;
        return this as any as Pick<MessageResolver<T,K>, 'createMountMsgFn'>
    }
    //TODO check if data key exists
    //**Map key from Payload Object */

    public createMountMsgFn() {
        //this should be destination key 

        const primaryKey = this._primaryKey;
        const mapperAccessor = this._mapObj;
        const payload = PayloadWrapper.wrapPayload(this._payloadObj);
        const mapperErr = checkAgainstUndefined(mapperAccessor);

        if (mapperErr.err) {
            payload.overrideError(mapperErr);
            return (message: WebSocket.Data) => {
                return payload;
            }
        }

        return (message: WebSocket.Data) => {
            //**Here is message take explicity as string */
            const [maybeMsg, maybeJsonErr] = tryFnRun(JSON.parse, message as string) as [SCMessage, ErrPassingObj];
            if (maybeJsonErr.err) return payload.overrideError(maybeJsonErr);

            const maybeMapper = mapperAccessor.get(maybeMsg[primaryKey]);
            const maybeMapperErr = checkAgainstUndefined(maybeMapper);
            if (maybeMapperErr.err) return payload.overrideError(maybeMapperErr);


            let p = payload.assignMessage(maybeMsg)
                .assignMapper(maybeMapper)
                .clearErr();
            return p
        };
    }
}