import express from "express";
import txt from './Text_Files/alpha.txt';
import WebSocket from 'ws';
import mainController from './Socket_Controller/Main_Controller';
import {startErrorHandling} from './Socket_Controller/utilites/src/error_handling/error_handling'

console.log('------------------------------------------------------------------------')
startErrorHandling({errorLevel:'low'});
const app = express();
const port = 3000;
console.log(txt);
app.get('/', (req, res) => res.send('Hello World!'))



const wss = new WebSocket.Server({
  port: 3001,
  verifyClient: (client) => {
    const {host} = client.req.headers; 
    console.log(host);
    return true
  }
}).on('connection', (ws) => {
  ws.on('message', (message) => {
  ws.send(mainController(message));
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))