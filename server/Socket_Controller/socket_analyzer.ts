import WebSocket from 'ws';
import { stringify } from 'querystring';

//Here is example interface which each socket have to run 
interface SocketClientMessage {
    user: string;
    token: string;
    userType: string;
    dest: string;
    data: string;
}

type SocketData = SocketClientMessage & WebSocket.Data;


export default function socket_analyzer(message: SocketData) {
    let mountMsg = SD.mountMappingArr(objArr)
                      .mapObjToPrimaryKey('dest')
                      .createMountMsgFn()


}



let someMsg:SocketClientMessage ={
    user: 'Pawel',
    token: 'some',
    userType: '3',
    dest: 'some',
    data: 'string'
}

/* Here is pattern object for handling requests 
    let be = [
       {verifyUser:'admin',dest:'some', ctrl:ExampleCtrl},
       {verifyUser:'admin',dest:'some/other',ctrl:SuperCtrl},
       {verifyUser:'admin',dest:'other/some',ctrl:extraCtrl},
    ]
*/

let objArr = [
    { verifyUser: 'admin', dest: 'some' },
    { verifyUser: 'admin', dest: 'somd' },
    { verifyUser: 'admin', dest: 'some/other' },
    { verifyUser: 'admin', dest: 'other/some' },
]



//***Socket Demultiplexer */
class SD<K> {
    
    //**Create singleton instance */
    public static  mountMappingArr<T>(objArr: T[]) {
        return new SD(objArr) as Pick<SD<T>,'mapObjToPrimaryKey'>      
    }

    //**Private variables */
    private _mapObj: Map<string, K>;
    private _primaryKey:string;
    private constructor(private readonly _objArr:K[]){}

    //**Map object to primary key */
    public mapObjToPrimaryKey(primaryObjKey: string) {
        this._primaryKey = primaryObjKey;
        this._mapObj = new Map<string, K>();
        this._objArr.forEach(el => {
            this._mapObj.set(el[primaryObjKey], el)
        })
        return this as any as Pick<SD<K>,'mountMessage' | 'createMountMsgFn'>
    }

    //**Mount message */
    public mountMessage<T>(message:T) {
        //this should be destination key 
        return [message ,this._mapObj.get(message[this._primaryKey])] as [T,K]
    }

    //**Bind function which returns [message,mappingElement] */
    public createMountMsgFn() {
        //this should be destination key 
        return <T>(message:T) => [message ,this._mapObj.get(message[this._primaryKey])] as [T,K]
    }
}

let mountMsg = SD.mountMappingArr(objArr).mapObjToPrimaryKey('dest').createMountMsgFn()
console.log(mountMsg(someMsg))

const pipe = <T>(fn1: (a: T) => T, ...fns: Array<(a: T) => T>) =>
  fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)), fn1);

let add2 = (a:number) =>a +2;
let piped  = pipe(add2,add2)
console.log(piped(2));


function count(){
    let some = 0;
    function c() {
        some++
        return some
       
    }
    return c()
}
let m =count();
count()
count()
count()
console.log(m);
