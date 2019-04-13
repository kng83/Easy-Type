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
    let me = SD.Create
    .mountMappingArr(objArr)
    .mapObjToPrimaryKey('dest').mountMessage(message)
    
    return me

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

class SD {

    //**Create singleton instance */
    public static get Create() {
        return ((this as any)._instance || ((this as any)._instance = new SD())) as SD;
    }
    //**Private variables */
    private _instance: SD;
    private _objArr: any[];
    private _mapObj: Map<string, any>;
    private _primaryKey:string;

    //**Public api */
    public mountMappingArr<T>(objArr: T[]) {
        this._objArr = [...objArr] as T[]
        return this as Pick<SD,'mapObjToPrimaryKey'>
    }

    //**Map object to primary key */
    public mapObjToPrimaryKey<T>(primaryObjKey: string) {
        this._primaryKey = primaryObjKey;
        this._mapObj = new Map<string, T>();
        this._objArr.forEach(el => {
            this._mapObj.set(el[primaryObjKey], el)
        })
        return this;
    }

    //**Mount message */
    public mountMessage<T>(message:T) {
        //this should be destination key 
        return [message ,this._mapObj.get(message[this._primaryKey])];
    }

}


class SDD<K> {
    
    //**Create singleton instance */
    public static  mountMappingArr<T>(objArr: T[]) {
        return new SDD(objArr) as Pick<SDD<T>,'mapObjToPrimaryKey'>      
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
        return this as Pick<SDD<K>,'mountMessage'>
    }

    //**Mount message */
    public mountMessage<T>(message:T) {
        //this should be destination key 
        return [message ,this._mapObj.get(message[this._primaryKey])] as [T,K]
    } 

}

let a = SDD.mountMappingArr(objArr).mapObjToPrimaryKey('dest').mountMessage(someMsg)
console.log(a[1]);
