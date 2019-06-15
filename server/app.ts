import express from "express";
//import './Functional/functors';
//import './Functional/maybe';
//import './Functional/maybe_just_nothing.ts';
//import './Functional/either.ts';
import './Functional/container';

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));