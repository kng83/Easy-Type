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
    let me = SocketDemultiplexer.CreateInstance.messageResolver(message);
    return me
}

//** SocketDemultiplexer resolve socket to specify controller and user */
class SocketDemultiplexer {

    //**Singleton Instance of SocketDemultiplexer */
    private _instance: SocketDemultiplexer;
    //**Create singleton instance */
    public static get CreateInstance() {
        const self = this as any;
        return (self._instance || (self._instance = new this()))
    }

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
    mountCtrl(desc, fn: (data: string) => string) {
        if (desc = this.desc)
            return fn(this.data)
    }
}
let mes = new SocketParser();
mes.mountCtrl('some', (some) => some);