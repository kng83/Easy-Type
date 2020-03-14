import express from "express";
import {Response} from 'express';
import {userCtrl} from './Controllers/user.ctrl';
import bodyParser from 'body-parser';
import './db';


const app = express();
const port = 3000;



app.use(bodyParser.json({type:'application/*+json'}))
app.get('/', (req, res:Response) =>{
    res.removeHeader('X-Powered-By')
 res.send('Hello World!')
});

try{
    app.get('/getAll',userCtrl.getAll)
    app.get('/getByName',userCtrl.getByName)
    app.get('/insertUser',userCtrl.insertUser)

}catch(e){
    console.log(e);
}



app.listen(port, () => console.log(`Example app listening on port ${port}!`))