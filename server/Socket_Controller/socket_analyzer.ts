import { pipe } from './utilities/src/pipe/pipe';
import { checkForUndefined, tryFnRun, ErrPassingObj } from './utilities/src/error_handling/error_handling';
import { SD } from "./SD";




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

export interface Acc<K> {
    Err: ErrPassingObj
    data?: K;
}

//***passData is used also to pass errors */
export interface Payload<T, K> {
    message?: SCMessage,
    mapper?: Map<string,Mapper>
    acc: Acc<K>,
}

export interface SocketRouter {
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
// public static mountMappingArr<T>(dataArr: T[]) {
//     return new SD(dataArr) as Pick<SD<T>, 'setDataArrPrimaryKey'>;
// }
// //**Private variables */
// private _mapper: Map<string, K>;
// private _primaryKey: string;


// private constructor(private readonly _objArr: K[]) { }
export class PayloadWrapper<T, K>{


    public static wrapPayload<T, K>(payloadObj: Payload<T, K>) {
        return new PayloadWrapper(payloadObj) as PayloadWrapper<T, K>;
    }
    private constructor(private _payloadObj: Payload<T, K>) { }

    public get hasError() {
        return this._payloadObj.acc.Err.err;
    }

    //**Get data from Error, Acc, and mapper */
    public get errorObj() {
        return this._payloadObj.acc.Err;
    }
    public get accData() {
        return this._payloadObj.acc.data;
    }
    public get acc(){
        return this._payloadObj.acc;
    }
    public get mapperData(){
        return this._payloadObj.mapper;
    }
    
    //**Override Error, Data . They belong */
    public overrideError(err: ErrPassingObj) {
        this._payloadObj.acc.Err = err;
        return this;
    }
    public overrideData(data: K) {
        this._payloadObj.acc.data = data;
        return this;
    }

    public get messageData() {
        return this._payloadObj.message.data;
    }
    //Assign message, mapper and acc
    public assignMessage(message: SCMessage) {
        this._payloadObj.message = message;
        return this;
    }
    public assignMapper(mapper: Map<string,Mapper>) {
        this._payloadObj.mapper = mapper;
        return this;
    }
    public assignAcc(acc: Acc<K>) {
        this._payloadObj.acc = acc
        return this;
    }
    public clearErr() {
        this._payloadObj.acc.Err = {
            err: false
        }
        return this;
    }
    public rollErr() {
        this._payloadObj.message = undefined;
        this._payloadObj.mapper = undefined;
        this._payloadObj.acc.data = undefined;
        return this;
    }
}

// export class PayloadWrapper<T, K> implements Payload<T, K>{
//     message?: SCMessage;
//     mapper?: Mapper<T, K>;
//     acc: Acc<K>;
//     private get _default(): Payload<T, K> {
//         return {
//             acc: {
//                 Err: {
//                     err: false,
//                     errorData: undefined
//                 },
//                 data: undefined
//             },
//             message: {},
//             mapper: {}
//         }
//     }
//     constructor() {
//         this._initialize();
//     }
//     private _initialize() {
//         this.acc = this._default.acc;
//         this.message = this._default.message;
//         this.mapper = this._default.mapper;
//     }
//     public get hasError() {
//         return this.acc.Err.err;
//     }

//     public get getErrorObj() {
//         return this.acc.Err;
//     }
//     public get getAccData() {
//         return this.acc.data;
//     }
//     public overrideError(err: ErrPassingObj) {
//         this.acc.Err = err;
//         return this;
//     }
//     public overrideData(data: K) {
//         this.acc.data = data;
//         return this;
//     }
//     public set setError(err: ErrPassingObj) {
//         this.acc.Err = err;
//     }
//     public getMessageData() {
//         return this.message.data;
//     }
//     //Assign message, mapper and acc
//     public assignMessage(message: SCMessage) {
//         this.message = message;
//         return this;
//     }
//     public assignMapper(mapper: Mapper<T, K>) {
//         this.mapper = mapper;
//         return this;
//     }
//     public assignAcc(acc: Acc<K>) {
//         this.acc = acc
//         return this;
//     }
//     public clearErr() {
//         this.acc.Err = this._default.acc.Err;
//         return this;
//     }
//     public rollErr() {
//         this.message = {};
//         this.mapper = {};
//         this.acc.data = undefined;
//         return this;
//     }
// }


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
    console.log(p._payloadObj);
  
    if (p.hasError) return p.rollErr();
    let [maybeData, maybeErr] = tryFnRun(p.mapperData.ctrl, p.messageData);
    if (maybeErr.err) return p.overrideError(maybeErr);
    return p.overrideData(maybeData);
}


//**Send async message */
export async function sendMessage<T, K>(payload: Promise<PayloadWrapper<T, K>>) {
    let p = await payload;
    //** TODO make some error handling before sending */
    if (p.hasError) return JSON.stringify(p.errorObj);
    return JSON.stringify(await p.accData);
}

//**Converting payload to promise */
export function convertPayloadToPromise<T, K>(payload: PayloadWrapper<T, K>) {
    return Promise.resolve(payload);
}
