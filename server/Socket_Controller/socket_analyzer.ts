import WebSocket from 'ws';
import { stringify } from 'querystring';
import { pipe } from './utilites/src/pipe';
import { isNumber } from 'util';
//import {pipe} from './utilites/utilites';



interface SCMessage {
    user:string;
    userType:string;
    data:any;
}

/* Here is pattern object for handling requests 
    let be = [
       {verifyUser:'admin',dest:'some', ctrl:ExampleCtrl},
       {verifyUser:'admin',dest:'some/other',ctrl:SuperCtrl},
       {verifyUser:'admin',dest:'other/some',ctrl:extraCtrl},
    ]
*/

interface Mapper {
    verifyUser: string;
    dest: string;
    ctrl: <T, U>(data: T) => U
}
interface PassErr {
    err: boolean | null | undefined;
    [key: string]: any;
}
interface PassData<T> extends PassErr {

} 

//***passData is used also to pass errors */
interface PassingData<R, S, T> {
    message: R,
    mapper: S,
    passData: T,
}

export default function socket_analyzer(message) {
    let objArr = [
        { verifyUser: 'admin', dest: 'some', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 4, ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'some/other', ctrl: makeEchoCtrl },
        { verifyUser: 'admin', dest: 'other/some', ctrl: makeEchoCtrl },
    ]

    let mountMsgFn = SD.mountMappingArr(objArr)
        .mapObjToPrimaryKey('dest')
        .createMountMsgFn()

    let passer = mountMsgFn(message)
    console.log(passer);
    let msg = pipe(runCtrl, sendMessage)(passer);

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
            const passData:PassData<any> = { err: false }
            let msg = JSON.stringify("");

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
function verifyUser<T>(payload: PassingData<SCMessage, Mapper, PassData<T>>) {
    if (payload.passData.err) return payload;
    const { mapper } = payload;
    //Todo some staff
    return payload;
}

//**Running the ctrl */
function runCtrl<T>(payload: PassingData<SCMessage, Mapper, PassData<T>>) {
    console.log(payload);
    if (payload.passData.err) return payload;
    //---
    console.log(payload);
    const { mapper } = payload;
    payload.passData = mapper.ctrl(payload.message.data)
    return payload;
}//
//
//** send message*/
function sendMessage<T>(payload: PassingData<SCMessage, Mapper, PassData<T>>) {
    //** TODO make some error handling before sending */
    let { passData } = payload;
    return passData;
}


let makeEchoCtrl = <T>(data: T) => {
    return data;
}

let objArr = [
    { verifyUser: 'admin', dest: 'some', ctrl: makeEchoCtrl },
    { verifyUser: 'admin', dest: 'somd', ctrl: makeEchoCtrl },
    { verifyUser: 'admin', dest: 'some/other', ctrl: makeEchoCtrl },
    { verifyUser: 'admin', dest: 'other/some', ctrl: makeEchoCtrl },
]
