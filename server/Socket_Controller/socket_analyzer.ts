import WebSocket from 'ws';
import { stringify } from 'querystring';
import { pipe } from './utilites/src/pipe';
import { isNumber } from 'util';
//import {pipe} from './utilites/utilites';



interface SCMessage  {
    user:string;
    userType:string;
    dest:string;
    data:any;
}

type Foo<T> = T extends { a: infer U, b: infer U } ? U : never;
type Ctrl<T,R> = (data:T) => R;

interface Mapper<T,R> {
    verifyUser: string;
    dest: string;
    ctrl: Ctrl<T,R>;
}

interface PassData<K>{
    err: boolean | null | undefined;
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

    let mountMsgFn = SD.mountMappingArr(objArr)
        .mapObjToPrimaryKey('dest')
        .createMountMsgFn()

    let passer = mountMsgFn(message)
    console.log(passer);
    let msg = pipe(runCtrl, sendMessage)(passer);

    return msg;
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
            const passData = { err: false, data: {} }
            let msg = JSON.stringify("") as any as SCMessage;

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

//

//**Verification for now is dummy */
function verifyUser<T,K>(payload: Payload<T,K>) {
    if (payload.passData.err) return payload;
    const { mapper } = payload;
    //Todo some staff
    return payload;
}

//**Running the ctrl */
function runCtrl<T,K>(payload: Payload<T,K>) {
    console.log(payload);
    if (payload.passData.err) return payload;
    //---
    console.log(payload);
    const { mapper } = payload;
    payload.passData.data = mapper.ctrl(payload.message.data)
    return payload;
}
//
//** send message*/
function sendMessage<T,K>(payload: Payload<T,K>) {
    //** TODO make some error handling before sending */
    let { passData } = payload;
    if(passData.err){
        return passData.err;
    }
    return passData.data;
}


let makeEchoCtrl= (data: string) => {
    return data;
}

let retFive = (data:string) =>{
    return 5;
}

let cbCtrl = (data:string, fn)=>{
    return fn(data);
}

let w =cbCtrl('1sss0',(d)=>{
    setTimeout(()=>{
        return d.length;
    },4000)  
})
console.log(w);



function asyncFn(params, callback) {
    setTimeout(function() {
        if (callback) {callback(params);}
    }, 0);
}

console.log('a')
let k = asyncFn('some',console.log);
console.log('b');

let f =  asyncFn('so',(w)=>{
    setTimeout(()=>{
        return 5;
    },2000)
})

console.log(w);