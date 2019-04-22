import WebSocket from 'ws';
import { stringify } from 'querystring';
import { pipe } from './utilites/src/pipe/pipe';
//import {asyncPipe} from './utilites/src/async_pipe';
import { isNumber } from 'util';
//import {pipe} from './utilites/utilites';
import { checkForUndefined, tryFnReturn as tryFnRun, ErrPassingObj, checkAgainstUndefined } from './utilites/src/error_handling/error_handling';
import { Z_UNKNOWN } from 'zlib';
import { platform } from 'os';



interface SCMessage {
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
interface PayloadMutation{

}

export default function socket_analyzer(message) {
    let objArr = [
        { verifyUser: 'admin', dest: 'some', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'some/other', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'other/some', ctrl: makeEchoCtrl },
    ]
    //
    let objArr2 = [
        { verifyUser: 'admin', dest: 'some', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'some/other', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'other/some', ctrl: makeEchoCtrl },
    ]

    let mountMsgFn = SD.mountMappingArr(objArr)
        .mapObjToPrimaryKey('dest')
        .createMountMsgFn()



    let passer = mountMsgFn(message)
    //   console.log(passer,'sss');
    let msg = pipe(runCtrl, sendMessage)(passer);
    return msg;
}

class PayloadWrapper<T,K> implements Payload<T,K>{
    message?: SCMessage;
    mapper?: Mapper<T, K>;
    acc: Acc<K>;
    private get _default():Payload<T,K>{
        return {
        acc : {
            Err: {
                err: false,
                errorData: undefined
            },
            data: undefined
        },
        message : {},
        mapper : {}
    }
    }
    constructor() {
        this._initialize();
    }
    private _initialize() {
        this.acc= this._default.acc;
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
    public overrideError(err:ErrPassingObj){
        this.acc.Err = err;
        return this;
    }
    public overrideData(data:K){
        this.acc.data = data;
        return this;
    }
    public set setError(err:ErrPassingObj){
        this.acc.Err = err;
    }
    public getMessageData() {
        return this.message.data;
    }
    //Assign message, mapper and acc
    public assignMessage(message:SCMessage){
        this.message = message;
        return this;
    }
    public assignMapper(mapper:Mapper<T, K>){
        this.mapper = mapper;
        return this;
    }
    public assignAcc(acc:Acc<K>){
        this.acc = this.acc
        return this;
    }
    public clearErr(){
        this.acc.Err= this._default.acc.Err;
        return this;
    }
    public rollErr(){
        this.message = {};
        this.mapper = {};
        this.acc.data= undefined;
        return this;
    }

}


//***Socket Demultiplexer */
class SD<K> {

    //**Create singleton instance */
    public static mountMappingArr<T>(objArr: T[]) {
        return new SD(objArr) as Pick<SD<T>, 'mapObjToPrimaryKey'>
    }

    //**Private variables */
    private _mapper: Map<string, K>;
    private _primaryKey: string;
    private constructor(private readonly _objArr: K[]) { }


    //**Map object to primary key */
    public mapObjToPrimaryKey(primaryObjKey: string) {
        this._primaryKey = primaryObjKey;
        this._mapper = new Map<string, K>();
        this._objArr.forEach(el => {
            this._mapper.set(el[primaryObjKey], el)
        })
        return this as any as Pick<SD<K>, 'createMountMsgFn'>
    }

    //**Bind function which returns [message,mappingElement] */
    public createMountMsgFn() {
        //this should be destination key 
        return (message: string) => {
            let payload = new PayloadWrapper<unknown,K>();
            let p = {...payload};


            const msgErr = checkAgainstUndefined(message);
            if(msgErr.err) return payload.overrideError(msgErr);
            
            const [maybeMsg, maybeJsonErr] = tryFnRun(JSON.parse, message) as [SCMessage, ErrPassingObj]
            if (maybeJsonErr.err) return payload.overrideError(maybeJsonErr)

            const maybeMapper = this._mapper.get(maybeMsg[this._primaryKey])
            const maybeMapperErr = checkAgainstUndefined(maybeMapper);

            if(maybeMapperErr.err) return payload.overrideError(maybeJsonErr);
            return payload.assignMessage(maybeMsg)
                          .assignMapper(maybeMapper)
                          .clearErr()
                          
        }
    }
}

//**Verification for now is dummy */
function verifyUser<T, K>(payload: PayloadWrapper<T, K>) {
    if (payload.acc.Err.err) return payload;
    const { mapper } = payload;
    //Todo some staff
    return payload;

}

//**Running the ctrl */
function runCtrl<T, K>(payload: PayloadWrapper<T, K>) {
    if (payload.hasError) return payload.rollErr();
    let [maybeData, maybeErr] = tryFnRun(payload.mapper.ctrl, payload.message.data);
    if (maybeErr.err) return  payload.overrideError(maybeErr);

    
    return payload.overrideData(maybeData);
}

//**Running the ctrl */


//** send message*/
function sendMessage<T, K>(payload: PayloadWrapper<T, K>) {
    //** TODO make some error handling before sending */
    console.log(payload.getErrorObj.errorData);
    if(payload.hasError) return JSON.stringify(payload.getErrorObj);
    return JSON.stringify(payload.getAccData);
}


let makeEchoCtrl = (data: string) => {
    return data;
}


function add(n1: number, n2: number) {
    return n1 + n2;
}

