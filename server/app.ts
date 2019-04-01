const uWS = require('uWebSockets.js');
const port = 9001;

const app = uWS.SSLApp({
  key_file_name: 'misc/39321665_localhost.key',
  cert_file_name: 'misc/39321665_localhost.cert',
  passphrase: '1234'
}).any('/anything', (res, req) => {
  res.end('Any route with method: ' + req.getMethod());``
}).get('/user/agent', (res, req) => {
  /* Read headers */
  res.end('Your user agent is: ' + req.getHeader('user-agent') + ' thank you, come again!');
}).get('/static/yes', (res, req) => {
  /* Static match */
  res.end('This is very static');
}).get('/candy/:kind', (res, req) => {
  /* Parameters */
  res.end('So you want candy? Have some ' + req.getParameter(0) + '!');
}).get('/*', (res, req) => {
  /* Wildcards - make sure to catch them last *///
  res.end('HelloWord');
}).listen(port, (token) => {
  if (token) {
    console.log('Listening to port ' + port);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});

 import express from "express";
// import txt  from './Text_Files/alpha.txt';

// const apps = express();
// const ports = 3000;
// console.log(txt);
// apps.get('/', (req, res) => res.send('Hello World!'))

// apps.listen(ports, () => console.log(`Example app listening on port ${ports}!`))



// import https from 'https'
// import fs from 'fs';

// const options = {
//   key: fs.readFileSync("misc/39321665_localhost.key"),
//   cert: fs.readFileSync("misc/39321665_localhost.cert")
// };

// const apps = express();
// let p2 = 4800;

// apps.use((req, res) => {
//   res.writeHead(200);
//   res.end("hello worlddd\n");
// });


// apps.get('/', (req, res) => res.send('Hello World!'))
// https.createServer(options, apps).listen(p2, () =>console.log(`Example app listening on port ${p2}!`));
