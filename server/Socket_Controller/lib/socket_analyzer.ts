import { tryFnRun, asyncTryFnRun } from 'error-resolver';
import {IErrorPassingStruct} from 'error-resolver';
export interface SCMessage {
    user?: string;
    userType?: string;
    dest?: string;
    data?: any;
}

type Ctrl<T, K> = (data: T) => K;

export interface Mapper{
    verifyUser?: string;
    dest?: string;
    ctrl?: (data:any)=>any;
}

export interface Acc<T> {
    Err: IErrorPassingStruct
    data?: T;
}

//***passData is used also to pass errors */
export interface Payload<T> {
    message?: SCMessage,
    mapper?: Mapper
    acc: Acc<T>,
}

export interface SocketRouter {
    verifyUser: string;
    dest: string;
    ctrl: (data: any) => any;
}

export class PayloadWrapper<P>{

    public static wrapPayload<T>(payloadObj: Payload<T>) {
        return new PayloadWrapper(payloadObj) as PayloadWrapper<T>;
    }
    private constructor(private _payloadObj: Payload<P>) { }

    public get acc(){
        return this._payloadObj.acc;
    }
    public get mapper(){
        return this._payloadObj.mapper;
    }
    public get message(){
        return this._payloadObj.message;
    }
    
    //**Override Error, Data . They belong */
    public overrideError(err: IErrorPassingStruct) {
        this._payloadObj.acc.Err = err;
        return this;
    }
    //**Only data which should be override is in Acc */
    public overrideData(data: P) {
        this._payloadObj.acc.data = data;
        return this;
    }

    //Assign message, mapper and acc
    public assignMessage(message: SCMessage) {
        this._payloadObj.message = message;
        return this;
    }
    public assignMapper(mapper: Mapper) {
        this._payloadObj.mapper = mapper;
        return this;
    }
    public assignAcc(acc: Acc<P>) {
        this._payloadObj.acc = acc
        return this;
    }

    //Errors
    public get hasError() {
        return this._payloadObj.acc.Err.hasError;
    }
    public get errorObj() {
        return this._payloadObj.acc.Err;
    }
    public clearErr() {
        this._payloadObj.acc.Err = {
            hasError: false
        }
        return this;
    }
    public rollErr() {
        this._payloadObj.message = undefined;
        this._payloadObj.mapper = undefined;
        this._payloadObj.acc.data = undefined;
        return this;
    }

    //**Remove wrapping from object */
    public unWrap():Payload<P>{
        return {
            message:this.message,
            acc:this.acc,
            mapper:this.mapper
        }
    }
}

//**Verification for now is dummy */
export async function verifyUser<T>(payload: Promise<PayloadWrapper<T>>) {
    let p = await payload;
    if (p.hasError) return payload;
    //Todo some staff
    return payload;
}

//**Running the asyncCtrl */
export async function runCtrl<T>(payload: Promise<PayloadWrapper<T>>) {
    let p = await payload;
    if (p.hasError) return p.rollErr();

    let [maybeData, maybeErr] = await asyncTryFnRun(p.mapper.ctrl, p.message.data);
    if (maybeErr.hasError) return p.overrideError(maybeErr);
    return p.overrideData(maybeData);
}


//**Send async message */
export async function sendMessage<T>(payload: Promise<PayloadWrapper<T>>) {
    let p = await payload;

    //** TODO make some error handling before sending */
    if (p.hasError) return JSON.stringify(p.errorObj);
    return JSON.stringify(p.acc);
}

//**Converting payload to promise */
export function convertPayloadToPromise<T>(payload: PayloadWrapper<T>) {
    return Promise.resolve(payload);
}
