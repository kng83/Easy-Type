import { match, add, map, prop, identity, strAdd, toUpper, compose, curry, append,toString,tap,either,inspection,head,split} from './common';
import util from 'util';
import fs from 'fs';

class Task {
    public fork;
    constructor(fork) {
      this.fork = fork;
    }
  
    [util.inspect.custom]() {
      return 'Task(?)';
    }
  
    static rejected(x) {
      return new Task((reject, _) => reject(x));
    }
  
    // ----- Pointed (Task a)
    static of(x) {
      return new Task((_, resolve) => resolve(x));
    }
  
    // ----- Functor (Task a)
    map(fn) {
      return new Task((reject, resolve) => this.fork(reject, compose(resolve, fn)));
    }
  
    // ----- Applicative (Task a)
    ap(f) {
      return this.chain(fn => f.map(fn));
    }
  
    // ----- Monad (Task a)
    chain(fn) {
      return new Task((reject, resolve) => this.fork(reject, x => fn(x).fork(reject, resolve)));
    }
  
    join() {
      return this.chain(identity);
    }
  }
  
  const readFile = filename => new Task((reject, result) => {//
    fs.readFile(filename, (err, data) => (err ? reject(err) : result(data)));
  });

  //to nie wiem dlaczego nie dziala
  //readFile('./webpack.config.ts').map(split('\n')).map(head).fork((err,val)=>console.log(err,val));
 