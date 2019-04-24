import { pipe } from './utilities/src/pipe/pipe';
import { checkForUndefined, tryFnRun, ErrPassingObj } from './utilities/src/error_handling/error_handling';
import { SD } from './SD';




export interface SCMessage {
    user?: string;
    userType?: string;
    dest?: string;
    data?: any;
}

type Ctrl<T, R> = (data: T) => R;

interface Mapper<T, K> {
    verifyUser?: string;
    dest?: string;
    ctrl?: Ctrl<T, K>;
}

interface Acc<K> {
    Err: ErrPassingObj
    data?: K;
}

//***passData is used also to pass errors */
interface Payload<T, K> {
    message?: SCMessage,
    mapper?: Mapper<T, K>,
    acc: Acc<K>,
}

interface SocketRouter {
    verifyUser: string;
    dest: string;
    ctrl: (data: any) => any;
}

/** Mounting router and return function which handles messages 
 * Use example:
 * 
 * let objArr2 = [
 *    { verifyUser: 'admin', dest: 'some', ctrl: asyncMakeEchoCtrl },
 *    { verifyUser: 'admin', dest: 'war', ctrl: asyncFetchCtrl },
 *    { verifyUser: 'admin', dest: 'other/some', ctrl: asyncMakeEchoCtrl },
 * ]

 * let msgFn = socketAnalyzer(objArr2)
 *      .mapObjToPrimaryKey('dest')
 *      .createMountMsgFn();

 * let messagePromise = pipe(convertPayloadToPromise,verifyUser,runCtrl,sendMessage)(msgFn(message));
*/
export function socketAnalyzer(router: SocketRouter[]) {
    return SD.mountMappingArr(router)

}

export class PayloadWrapper<T, K> implements Payload<T, K>{
    message?: SCMessage;
    mapper?: Mapper<T, K>;
    acc: Acc<K>;
    private get _default(): Payload<T, K> {
        return {
            acc: {
                Err: {
                    err: false,
                    errorData: undefined
                },
                data: undefined
            },
            message: {},
            mapper: {}
        }
    }
    constructor() {
        this._initialize();
    }
    private _initialize() {
        this.acc = this._default.acc;
        this.message = this._default.message;
        this.mapper = this._default.mapper;
    }
    public get hasError() {
        return this.acc.Err.err;
    }

    public get getErrorObj() {
        return this.acc.Err;
    }
    public get getAccData() {
        return this.acc.data;
    }
    public overrideError(err: ErrPassingObj) {
        this.acc.Err = err;
        return this;
    }
    public overrideData(data: K) {
        this.acc.data = data;
        return this;
    }
    public set setError(err: ErrPassingObj) {
        this.acc.Err = err;
    }
    public getMessageData() {
        return this.message.data;
    }
    //Assign message, mapper and acc
    public assignMessage(message: SCMessage) {
        this.message = message;
        return this;
    }
    public assignMapper(mapper: Mapper<T, K>) {
        this.mapper = mapper;
        return this;
    }
    public assignAcc(acc: Acc<K>) {
        this.acc = this.acc
        return this;
    }
    public clearErr() {
        this.acc.Err = this._default.acc.Err;
        return this;
    }
    public rollErr() {
        this.message = {};
        this.mapper = {};
        this.acc.data = undefined;
        return this;
    }
}


//**Verification for now is dummy */
export async function verifyUser<T, K>(payload: Promise<PayloadWrapper<T, K>>) {
    let p = await payload;
    if (p.hasError) return payload;
    //Todo some staff
    return payload;

}

//**Running the asyncCtrl */
export async function runCtrl<T, K>(payload: Promise<PayloadWrapper<T, K>>) {
    let p = await payload;
    if (p.hasError) return p.rollErr();
    let [maybeData, maybeErr] = tryFnRun(p.mapper.ctrl, p.message.data);
    if (maybeErr.err) return p.overrideError(maybeErr);
    return p.overrideData(maybeData);
}


//**Send async message */
export async function sendMessage<T, K>(payload: Promise<PayloadWrapper<T, K>>) {
    let p = await payload;
    //** TODO make some error handling before sending */
    if (p.hasError) return JSON.stringify(p.getErrorObj);
    return JSON.stringify(await p.getAccData);
}

//**Converting payload to promise */
export function convertPayloadToPromise<T, K>(payload: PayloadWrapper<T, K>) {
    return Promise.resolve(payload);
}
