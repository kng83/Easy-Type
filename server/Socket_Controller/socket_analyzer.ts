import WebSocket from 'ws';
import { stringify } from 'querystring';
import {pipe} from './utilites/utilites';
//import {pipe} from './utilites/pipe';


//Here is example interface which each socket have to run 
interface SCMessage {
    user: string;
    token: string;
    userType: string;
    dest: string;
    data: WebSocket.Data;
}

/* Here is pattern object for handling requests 
    let be = [
       {verifyUser:'admin',dest:'some', ctrl:ExampleCtrl},
       {verifyUser:'admin',dest:'some/other',ctrl:SuperCtrl},
       {verifyUser:'admin',dest:'other/some',ctrl:extraCtrl},
    ]
*/

interface Mapper {
    verfiyUser: string;
    dest: string;
    ctrl: <T, U>(data: T) => U
}
interface PassErr {
    err: boolean | null | undefined;
    [key: string]: any;
}
type PassData<T> = PassErr & T;



//***passData is used also to pass errors */
interface PassingData<R, S, T> {
    message: R,
    mapper: S,
    passData: T,
}

export default function socket_analyzer(message) {
    let mountMsgFn = SD.mountMappingArr(objArr)
        .mapObjToPrimaryKey('dest')
        .createMountMsgFn()
    
    return pipe(runCtrl,verifyUser,sendMessage);
    
}



let someMsg: SCMessage = {
    user: 'Pawel',
    token: 'some',
    userType: '3',
    dest: 'some',
    data: 'string'
}

let objArr = [
    { verifyUser: 'admin', dest: 'some' },
    { verifyUser: 'admin', dest: 'somd' },
    { verifyUser: 'admin', dest: 'some/other' },
    { verifyUser: 'admin', dest: 'other/some' },
]

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
        return <T>(message: T) => {
            return {
                message,
                mapper: this._mapper.get(message[this._primaryKey]),
                err: null
            }
        }
    }
}


let mountMsg = SD.mountMappingArr(objArr).mapObjToPrimaryKey('dest').createMountMsgFn()
console.log(mountMsg(someMsg))

//**Verification for now is dummy */
function verifyUser<T>(payload: PassingData<SCMessage, Mapper, PassData<T>>) {
    if (payload.passData.err) return payload;
    const { mapper } = payload;
    //Todo some staff
    return payload;
}

//**Running the ctrl */
function runCtrl<T>(payload: PassingData<SCMessage, Mapper, PassData<T>>) {
    if (payload.passData.err) return payload;
    //---
    const { mapper } = payload;
    payload.passData = mapper.ctrl(payload.message.data)
    return payload;
}

//** send message*/
function sendMessage<T>( payload : PassingData<SCMessage, Mapper, PassData<T>>) {
    //** TODO make some error handling before sending */
    let {passData} = payload;
    return passData;
}


