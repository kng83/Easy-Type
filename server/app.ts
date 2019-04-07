
import app from 'uWebSockets.js'
import ws from 'uWebSockets.js'
import fs from 'fs';
import qs from 'qs';
const port = 9001;
const page = fs.readFileSync('./index.html');

const apps = app./*SSL*/App({
  key_file_name: 'misc/39321665_localhost.key',
  cert_file_name: 'misc/39321665_localhost.cert',
  passphrase: '1234'

}).get('/id', (res, req) => {
  res.writeHeader('some','Text/Plain');
  res.writeHeader('some','Text/JSON');
  res.writeHeader('Content-Type','Text/JSON');
  res.writeHeader('Content-Type','Raw');
 // res.writeHeader('Content-Length', '18')
  console.log(res.getRemoteAddress());
  console.log(new Uint8Array(res.getRemoteAddress()))
  console.log('X-Real-IP: ' + req.getHeader('x-real-ip'));
  console.log('X-Forwarded-For: ' + req.getHeader('x-forwarded-for'));
  console.log('X-Forwarded-For: ' + req.getHeader('x-forwarded-for'));
  console.log(req.getHeader('content-length'))

  
  res.end('Kukuruku');

}).get('/user/agent', (res, req) => {
  /* Read headers */
  console.log(req.getHeader(''))
  res.writeHeader('uWebSockets', 'kot');
  res.writeHeader('Content-Type','text/plain');

  res.end('Your user agent is: ' + req.getHeader('user-agent') + ' thank you, come again!');
}).get('/static/yes', (res, req) => {
  
  /* Static match */
  res.end('This is very static');
}).get('/candy/:kind', (res, req) => {
  /* Parameters */
  res.end('So you want candy? Have some ' + req.getParameter(0) + '!');
}).get('/*', (res, req) => {
  console.log(qs.parse(req.getQuery()))
  
  return res.end(page);
}).listen(port, (token) => {

  if (token) {
    console.log('Listening to port ' + port);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});

