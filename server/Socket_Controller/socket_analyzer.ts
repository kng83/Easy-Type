import WebSocket from 'ws';
import { stringify } from 'querystring';
import { pipe } from './utilites/src/pipe/pipe';
//import {asyncPipe} from './utilites/src/async_pipe';
import { isNumber } from 'util';
//import {pipe} from './utilites/utilites';
import { checkForUndefined, tryFnReturn, ErrPassingObj } from './utilites/src/error_handling/error_handling';



interface SCMessage {
    user: string;
    userType: string;
    dest: string;
    data: any;
}

type Ctrl<T, R> = (data: T) => R;

interface Mapper<T, R> {
    verifyUser: string;
    dest: string;
    ctrl: Ctrl<T, R>;
}

interface PassData<K> {
    Err: ErrPassingObj
    data?: K;
    [key: string]: any;
}

//***passData is used also to pass errors */
interface Payload<T, K> {
    message?: SCMessage,
    mapper?: Mapper<T, K>,
    passData: PassData<K>,
}

export default function socket_analyzer(message) {
    let objArr = [
        { verifyUser: 'admin', dest: 'some', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: '5', ctrl: retFive },
        { verifyUser: 'admin', dest: 'some/other', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'other/some', ctrl: makeEchoCtrl },
    ]
    //
    let objArr2 = [
        { verifyUser: 'admin', dest: 'some', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: '5', ctrl: retFive },
        { verifyUser: 'admin', dest: 'some/other', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'other/some', ctrl: makeEchoCtrl },
    ]

    let mountMsgFn = SD.mountMappingArr(objArr)
        .mapObjToPrimaryKey('dest')
        .createMountMsgFn()

    let passer = mountMsgFn(message)
   //   console.log(passer,'sss');
    let msg = pipe(runCtrl, sendMessage)(passer);
     console.log(msg,'msg/n');
    return 'msg';//
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
    public createMountMsgFn(){
        //this should be destination key 
        return (message: string) => {
            let passData: PassData<unknown> = {
                Err: { err: false },
                data: undefined
            }
            passData.Err = checkForUndefined(message, this.createMountMsgFn);
            if (passData.Err.err) return { passData: passData };

            let [maybeMsg ,maybeErr] = tryFnReturn(JSON.parse, message) as [SCMessage, ErrPassingObj]
            if (maybeErr.err) return Object.assign(passData,{Err:maybeErr});

            let maybeMapper = this._mapper.get(maybeMsg[this._primaryKey])
            passData.Err = checkForUndefined(maybeMapper, this.createMountMsgFn);
            if (passData.Err.err) return { passData: passData }

            return {
                message: maybeMsg,
                mapper: maybeMapper,
                passData: passData               //
            }
        }
    }
}

//**Verification for now is dummy */
function verifyUser<T, K>(payload: Payload<T, K>) {
    if (payload.passData.Err.err) return payload;
    const { mapper } = payload;
    //Todo some staff
    return payload;
}

//**Running the ctrl */
function runCtrl<T, K>(payload: Payload<T, K>) {
    if (payload.passData.Err.err) return payload;
    //--
    const { mapper } = payload;
    console.log(payload,'\n');
    let [maybeData ,maybeErr] = tryFnReturn(mapper.ctrl, payload.message.data);
    console.log('=====================================');
    console.log(payload);
    if (maybeErr.err) return Object.assign(payload.passData.Err,maybeErr);
    payload.passData.data = maybeData; //Todo override data;
    console.log(payload)
    return payload;
}

//**Running the ctrl */
async function rCtrl<T, K>(payload: Payload<T, K>) {
    let asyncPayload = await payload;
    if (payload.passData.Err.err) return payload;
    //---
    const { mapper, passData } = payload;
            
    let [maybeData ,maybeErr] = tryFnReturn(mapper.ctrl, payload.message.data);
    console.log('=====================================');
    console.log(payload);
    if (maybeErr.err) return Object.assign(payload.passData.Err,maybeErr);

    payload.passData.data = maybeData;
    return payload;
}


//
//** send message*/
function sendMessage<T, K>(payload: Payload<T, K>) {
    //** TODO make some error handling before sending */
    let { passData } = payload;
    return JSON.stringify(passData.Err.err ? passData.Err: passData.data);
}

async function sMessage<T, K>(payload: Payload<T, K>) {
    //** TODO make some error handling before sending */
    let { passData } = await payload;
    if (passData.err) {
        return passData.err;
    }
    return passData.data;
}


let makeEchoCtrl = (data: string) => {
    return data;
}

let asyncEcho = async (data: Promise<string>) => {
    return await data;
}

let retFive = (data: string) => {
    return 5;
}


function add(n1: number, n2: number) {
    return n1 + n2;
}

