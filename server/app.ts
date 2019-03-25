import express from "express";
import txt  from './Text_Files/alpha.txt';
import './db';

const app = express();
const port = 3000;
console.log(txt);
app.get('/', (req, res) => res.send('Hello World!'));






app.listen(port, () => console.log(`Example app listening on port ${port}!`))