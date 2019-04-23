import WebSocket from 'ws';
import { socketAnalyzer, sendMessage, convertPayloadToPromise, verifyUser, runCtrl } from './socket_analyzer'
import { pipe } from './utilities/src/pipe/pipe';


let asyncMakeEchoCtrl = async (data: Promise<string>) => {
    return await data;
}

//**Testing async workflow */
let asyncFetchCtrl = async (data: Promise<string>) => {
    return await fetchSimulator(data);
}


//**Using for testing async workflow */
function fetchSimulator(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data)
        }, 4000)
    })
}

let objArr2 = [
    { verifyUser: 'admin', dest: 'some', ctrl: asyncMakeEchoCtrl },
    { verifyUser: 'admin', dest: 'bobo', ctrl: asyncFetchCtrl },
    { verifyUser: 'admin', dest: 'other/some', ctrl: asyncMakeEchoCtrl },
];

let msgFn = socketAnalyzer(objArr2)
    .mapObjToPrimaryKey('dest')
    .createMountMsgFn();

export default function mainController(message: WebSocket.Data) {
   return pipe(convertPayloadToPromise, verifyUser, runCtrl, sendMessage)(msgFn(message));
}