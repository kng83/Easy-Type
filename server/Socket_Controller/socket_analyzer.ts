import WebSocket from 'ws';
import { stringify } from 'querystring';

//Here is example interface which each socket have to run 
interface SocketClientMessage {
    user: string;
    token: string;
    userType: string;
    desc: string;
    data: string;
}

type SocketData = SocketClientMessage & WebSocket.Data;


export default function socket_analyzer(message: SocketData) {
    console.log(message);
    //Todo something like this
    //SocketDemultiplexer.MountMessage(message).ValidateAgainstUser('admin').MountController(exampleController)
    //SD.mountMessage(message).MountControllers([
    //    {verifyUser:'admin',ctrl:ExampleCtrl}
    //])
    //SocketDemultiplexer.CreateInstance.mountMessage(message)
    //SD.mountMessage(message).verifyUser('admin')
    return SocketDemultiplexer.CreateInstance.messageResolver(message);

}

//** SocketDemultiplexer resolve socket to specify controller and user */
class SocketDemultiplexer {


    //**Create singleton instance */
    public static get CreateInstance() {
        return ((this as any)._instance || ((this as any)._instance = new SocketDemultiplexer())) as SocketDemultiplexer

    }
    //**Singleton Instance of SocketDemultiplexer */
    private _instance: SocketDemultiplexer;

    /**Private data taken from message context */
    private userType: string;
    private token: string;
    private desc: string;
    private data: string;

    //**Mount message for  */
    messageResolver(message: SocketData) {
        this.userType = message.userType;
        this.token = message.token;
        this.desc = message.desc;
        this.data = message.data;
        return message;
    }

}

class SocketParser {
    private userType: string;
    private token: string;
    private desc: string;
    private data: string;

    verifyUser(userType: string) {
        this.userType = userType;
    }
    mountCtrl(desc: string, fn: (data: string) => string) {
        if (desc = this.desc)
            return fn(this.data)
    }
}
let mes = new SocketParser();
mes.mountCtrl('some', (some) => some);


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


function createMap<T>(objArr: T[], primaryObjKey: string) {
    let mapObj = new Map<string, T>();
    objArr.forEach(el => {
        mapObj.set(el[primaryObjKey], el)
    })
    return mapObj;
}

let s = createMap(objArr, 'dest');
console.log(s);

class SD {


    //**Create singleton instance */
    public static get Create() {
        return ((this as any)._instance || ((this as any)._instance = new SD())) as SD;
    }

    public mountMappingArr<T>(objArr: T[]) {
        this._objArr = [...objArr] as T[]
        return this;
    }

    //**Map object to primary key */
    public mapObjToPrimaryKey<T>(primaryObjKey: string) {
        this._mapObj = new Map<string, T>();
        console.log(this._objArr);
        this._objArr.forEach(el => {
          //  this._mapObj.set(el[primaryObjKey], el)
        })
        return this;
    }
    //**Singleton Instance of SocketDemultiplexer */
    private _instance: SD;
    private _objArr: any;
    private _mapObj: any;

    getObjArr() {
        return this._objArr;
    }
}

let me = SD.Create.mountMappingArr(objArr).mapObjToPrimaryKey('dest').getObjArr();
console.log(me);
