import WebSocket from 'ws';
import { tryFnRun, ErrPassingObj, checkAgainstUndefined } from './utilities/src/error_handling/error_handling';
import { PayloadWrapper, SCMessage } from './socket_analyzer';
import { stringify } from 'querystring';



//TODO make better
//***Socket Demultiplexer */
export class SD<K> {
    //**Create singleton instance */
    public static mountMappingArr<T>(dataArr: T[]) {
        return new SD(dataArr) as Pick<SD<T>, 'setDataArrPrimaryKey'>;
    }
    //**Private variables */
    private _mapper: Map<string, K>;
    private _primaryKey: string;


    private constructor(private readonly _objArr: K[]) { }


    //**Map object to primary key. Primary key is used for router powered by Map key value pairs*/
    public setDataArrPrimaryKey(primaryObjKey: string) {
        this._primaryKey = primaryObjKey;
        return this as any as Pick<SD<K>, 'createMapperObj'>;
    }
    //**Append map key to Instance object. This key will hold converted Mapping Array */
    public createMapperObj() {
        this._mapper = new Map<string, K>();
        this._objArr.forEach(el => {
            this._mapper.set(el[this._primaryKey], el);
        });

        return this as any as Pick<SD<K>, 'mountPayloadObj'>;
    }

    public mountPayloadObj<T,D extends  keyof T>(payloadObj: T, targetForMapper:D ) {
        let newPayload = { ...payloadObj, [targetForMapper]: this._mapper }
        return newPayload;
    }


}

export class MessageResolver<W>{
    //**Bind function which returns [message,mappingElement] */

    public static mountPayload<T>(payloadObj: T) {
        return new MessageResolver(payloadObj) as Pick<MessageResolver<T>, 'choosePrimaryKey'>;
    }

    private _primaryKey: string;
    private constructor(private payloadObj: W) { }

    public choosePrimaryKey(primaryMessageKey: string) {
        this._primaryKey = primaryMessageKey;
        return this as any as Pick<MessageResolver<W>, 'createMountMsgFn'>
    }

    public createMountMsgFn() {
        //this should be destination key 
        return (message: WebSocket.Data) => {
            let payload = new PayloadWrapper<unknown, W>();
            const msgErr = checkAgainstUndefined(message);

            if (msgErr.err) return payload.overrideError(msgErr);

            //**Here is message take explicity as string */
            const [maybeMsg, maybeJsonErr] = tryFnRun(JSON.parse, message as string) as [SCMessage, ErrPassingObj];
            if (maybeJsonErr.err) return payload.overrideError(maybeJsonErr);

            const maybeMapper = this.payloadObj.mapper.get(maybeMsg[this._primaryKey]);
            const maybeMapperErr = checkAgainstUndefined(maybeMapper);
            if (maybeMapperErr.err)return payload.overrideError(maybeJsonErr);


            return payload.assignMessage(maybeMsg)
                .assignMapper(maybeMapper)
                .clearErr();
        };
    }
}