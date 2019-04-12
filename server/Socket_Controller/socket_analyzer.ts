import WebSocket from 'ws';

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
    mountCtrl(desc:string, fn: (data: string) => string) {
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


//To effective routing they will be created two arrays.First 
//Make array which has in element has number of charter used in word
//example there is very long text: this/is/very/long/text/and/is/equal/37

function countCharAndPushToArray(arr:any[][],text:string){
    if(Array.isArray(arr[text.length])){
        arr[text.length].push(text);
    }else{
        arr[text.length] = [];
        arr[text.length].push(text);
    }
    return arr;
}

function createCharMap(arr:any[][],text:string){
    if(Array.isArray(arr[text.length])){
        arr[text.length].push(text);
    }else{
        arr[text.length] = [];
        arr[text.length].push(text);
    }
    return arr;
}

function recursionPosition(arr:any[][],value, ...positions){
    let [pos,...rest] = [...positions]
    if(rest.length>0){
        if(Array.isArray(arr[pos])){
            arr[pos].push(recursionPosition(arr[pos],value,...rest));
        }else{
            arr[pos] = [];
            arr[pos].push(arr[pos].push(recursionPosition(arr[pos],value,...rest)));
        }
    }else{
        if(Array.isArray(arr[pos])){
            arr[pos].push(value);
        }else{
            arr[pos] = [];
            arr[pos].push(value);
        }
        return arr;
    }

}


function srecursionPosition(arr:any[][],position:number,value){
    if(Array.isArray(arr[position])){
        arr[position].push(value);
    }else{
        arr[position] = [];
        arr[position].push(value);
    }
    return arr;
}

let some = 'text';
let arr = [];
recursionPosition(arr,some,some.length,some.charCodeAt(0));
recursionPosition(arr,'kot',3);
recursionPosition(arr,'pies',5);
recursionPosition(arr,'this/is/very/long/text/and/is/equal/37',12);
//arr[some.charCodeAt(0)]=some.charCodeAt(0);
console.log(arr);
console.log(arr[some.length][some.charCodeAt(0)][0])
let positions = [1]
let [pos,...rest] = [...positions]//
console.log(rest.length);
console.log(pos,rest);