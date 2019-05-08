import './error.init';
import express from "express";
import WebSocket from 'ws';
import mainController from './Socket_Controller/src/main_controller';

console.log('------------------------------------------------------------------------')


const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'))//

const wss = new WebSocket.Server({
  port: 3001,
  verifyClient: (client) => {
    const { host } = client.req.headers;
    console.log(host);
    return true
  }
}).on('connection', (ws) => {
  ws.on('message', (message) => {
    mainController(message).then(msg => {
    //  console.log(msg);
      useOfMemory();
      ws.send(msg)
    }).catch(err => console.log(err))
  });
}).on('close', (ws) => {
// console.log('close connection');
  ws.send('close')
})
//console.log(process.memoryUsage());
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function useOfMemory() {
  const used = process.memoryUsage();
 console.clear();
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
  return 0;
}
