import WebSocket from 'ws';
import { tryFnRun, ErrPassingObj, checkAgainstUndefined } from './utilities/src/error_handling/error_handling';
import { PayloadWrapper, SCMessage, Payload, Mapper } from './socket_analyzer';


export class MessageResolver<M extends Map<string, Mapper>, D> {
    //**Bind function which returns [message,mappingElement] */
    public static mountMapper<M extends Map<string, Mapper>>(mapperObj: M) {
        return new MessageResolver(mapperObj) as Pick<MessageResolver<M, unknown>, 'mountPayloadObj'>;
    }
    private _primaryKey: string;
    private _payloadObj: Payload<D>;
    private constructor(private _mapperObj: M) {
        return this;
    }
    public mountPayloadObj(payloadObj: Payload<D>) {
        this._payloadObj = payloadObj;
        return this as Pick<MessageResolver<M, unknown>, 'chooseMessageRoutingKey'>;
    }
    //**Primary key for messages */
    public chooseMessageRoutingKey(primaryMessageKey: string) {
        this._primaryKey = primaryMessageKey;
        return this as any as Pick<MessageResolver<M, D>, 'createMountMsgFn'>;
    }
    //TODO check if data key exists
    //**Map key from Payload Object */
    public createMountMsgFn() {
        //this should be destination key 
        const primaryKey = this._primaryKey;
        const mapperAccessor = this._mapperObj;
        const payload = PayloadWrapper.wrapPayload(this._payloadObj);
        const mapperErr = checkAgainstUndefined(mapperAccessor);
        if (mapperErr.err) {
            payload.overrideError(mapperErr);
            return (message: WebSocket.Data) => {
                return payload;
            };
        }
        return (message: WebSocket.Data) => {
            //**Here is message take explicity as string */
            const [maybeMsg, maybeJsonErr] = tryFnRun(JSON.parse, message as string) as [SCMessage, ErrPassingObj];
            if (maybeJsonErr.err)
                return payload.overrideError(maybeJsonErr);

            const maybeMapper = mapperAccessor.get(maybeMsg[primaryKey]);
            const maybeMapperErr = checkAgainstUndefined(maybeMapper);

            if (maybeMapperErr.err) return payload.overrideError(maybeMapperErr);
            
            let p = payload.assignMessage(maybeMsg)
                .assignMapper(maybeMapper)
                .clearErr();
            return p;
        };
    }
}
