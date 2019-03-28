import express from "express";
import txt  from './Text_Files/alpha.txt';
import {ctrl} from './Controllers/first.ctrl'

const app = express();
const port = 3000;
console.log(txt);
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/getAll',ctrl.getAll)
app.get('/getOldest',ctrl.getOldest);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))