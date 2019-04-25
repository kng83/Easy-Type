import WebSocket from 'ws';
import { socketAnalyzer, sendMessage, convertPayloadToPromise, verifyUser, runCtrl } from './socket_analyzer'
import { pipe } from './utilities/src/pipe/pipe';
import {MessageResolver} from './SD';




let asyncMakeEchoCtrl = async (data: Promise<string>) => {
    return await data;
}

//**Testing async workflow */
let asyncFetchCtrl = async (data: Promise<string>) => {
    console.log(data,'kkk');
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

let payload = socketAnalyzer(objArr2)
    .setDataArrPrimaryKey('dest')
    .createMapperObj()
    .mountPayloadObj(defaultPayload,'mapper');

let msgFn = MessageResolver
            .mountPayload(payload)
            .chooseMapKey('mapper')
            .chooseMessageRoutingKey('dest')
            .createMountMsgFn();

let makePipe = pipe(convertPayloadToPromise, verifyUser, runCtrl, sendMessage)
console.log(makePipe.toString());
export default function mainController(message: WebSocket.Data) {
   return makePipe(msgFn(message));
}