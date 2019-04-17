import WebSocket from 'ws';
import { stringify } from 'querystring';
import { pipe } from './utilites/src/pipe/pipe';
//import {asyncPipe} from './utilites/src/async_pipe';
import { isNumber } from 'util';
//import {pipe} from './utilites/utilites';
import {checkForUndefined} from './utilites/src/error_handling/error_handling';



interface SCMessage  {
    user:string;
    userType:string;
    dest:string;
    data:any;
}
 
type Ctrl<T,R> = (data:T) => R;

interface Mapper<T,R> {
    verifyUser: string;
    dest: string;
    ctrl: Ctrl<T,R>;
}

interface PassData<K>{
    err: boolean | null | undefined | Promise<boolean | null | undefined> 
    data?:K;
    [key: string]: any;
} 

//***passData is used also to pass errors */
interface Payload<T,K> {
    message: SCMessage,
    mapper: Mapper<T,K>,
    passData: PassData<K>,
}

export default function socket_analyzer(message) {
    let objArr= [
        { verifyUser: 'admin', dest: 'some', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: '5', ctrl: retFive },
        { verifyUser: 'admin', dest: 'some/other', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'other/some', ctrl: makeEchoCtrl },
    ]
//
    let objArr2= [
        { verifyUser: 'admin', dest: 'some', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: '5', ctrl: retFive },
        { verifyUser: 'admin', dest: 'some/other', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'other/some', ctrl: makeEchoCtrl },
    ]

    let mountMsgFn = SD.mountMappingArr(objArr)
        .mapObjToPrimaryKey('dest')
        .createMountMsgFn()

    let passer = mountMsgFn(message)
  ////  console.log(passer,'sss');
    let msg = pipe(runCtrl, sendMessage)(passer);
   // console.log(msg,'msg');
    return msg;//
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
           let s = checkForUndefined(undefined,this.createMountMsgFn);
            console.log(s);
            let passData = { err: false, data: {} }
            let msg:SCMessage;

            try {
                msg = JSON.parse(message) 
            } catch (e) {
                passData.err = true;
            }

            const mapper = this._mapper.get(msg[this._primaryKey])
            mapper == undefined ? passData.err = true : passData.err = false;

            return {
                message: msg,
                mapper,
                passData
            }
        }
    }
}

//**Verification for now is dummy */
function verifyUser<T,K>(payload: Payload<T,K>) {
    console.log('verifyUser');
    if (payload.passData.err) return payload;
    const { mapper } = payload;
    //Todo some staff
    return payload;
}

//**Running the ctrl */
function runCtrl<T,K>(payload: Payload<T,K>) {
    console.log(payload,'runCtrl');
    if (payload.passData.err) return payload;
    //---
    console.log(payload,'errr');
    const { mapper } = payload;
    payload.passData.data = mapper.ctrl(payload.message.data)
    return payload;
}

//**Running the ctrl */
async function  rCtrl<T,K>(payload: Payload<T,K>) {
    let asyncPayload = await payload;
    if (payload.passData.err) return payload;
    //---
    console.log(payload,'dddd');
    const { mapper } = payload;
    payload.passData.data = mapper.ctrl(payload.message.data)
    return payload;
}


//
//** send message*/
function sendMessage<T,K>(payload: Payload<T,K>) {
    //** TODO make some error handling before sending */
    let { passData } = payload;
        return JSON.stringify(passData.err ? passData.err : passData);
    
}

async function sMessage<T,K>(payload: Payload<T,K>) {
    //** TODO make some error handling before sending */
    let { passData } = await payload;
    if(passData.err){
        return passData.err;
    }
    return passData.data;
}


let makeEchoCtrl= (data: string) => {
    return data;
}

let  asyncEcho = async(data:Promise<string>)=>{
    return await data;
}

let retFive = (data:string) =>{
    return 5;
}


