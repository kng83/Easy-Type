import { match, add, map, prop, identity, strAdd, toUpper, compose, curry, append,toString,tap,either,inspection} from './common';

class IO {
    private $value;
    static of(x) {
      return new IO(() => x);
    }
  
    constructor(fn) {
      this.$value = fn;
    }
  
    map(fn) {
      return new IO(compose(fn, this.$value));
    }
  
    inspection() {
      return `IO(${inspection(this.$value)})`;
    }
    get value(){
      return this.$value;
    }
  }

  //example
  // ioWindow :: IO Window
const ob1 = {hight:100,width:50};
const ioWindow = new IO(() => ob1);
let io1 =ioWindow.map(ob => ob.hight);
console.log(io1.value());
// IO(1430)