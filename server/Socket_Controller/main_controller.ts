import WebSocket from 'ws';
import { sendMessage, convertPayloadToPromise, verifyUser, runCtrl } from './socket_analyzer'
import { pipe } from './utilities/src/pipe/pipe';
import { createMapFromArr } from "./createMapFromArr";
import { MessageResolver } from "./MessageResolver";




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
        }, 1000)
    })
}

let objArr2 = [
    { verifyUser: 'admin', dest: 'some', ctrl: asyncMakeEchoCtrl },
    { verifyUser: 'admin', dest: 'bobo', ctrl: asyncFetchCtrl },
    { verifyUser: 'admin', dest: 'koko', ctrl: asyncMakeEchoCtrl },
    { verifyUser: 'admin', dest: 'other/some', ctrl: asyncMakeEchoCtrl },
];

let defaultPayload = {
    acc: {
        Err: {
            err: false,
            errorData: undefined
        },
        data: undefined
    },
    message: undefined,
    mapper: undefined
}


let destMapper = createMapFromArr(objArr2,'dest');

let msgFn = MessageResolver
            .mountMapper(destMapper)
            .mountPayloadObj(defaultPayload)
            .chooseMessageRoutingKey('dest')
            .createMountMsgFn();

let makePipe = pipe(msgFn,convertPayloadToPromise, runCtrl, sendMessage)

export default function mainController(message: WebSocket.Data) {
    return makePipe(message);
}
   
