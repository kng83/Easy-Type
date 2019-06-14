import {curry} from './curry';

class Maybe {
    $value:any;

    static of(x) {
      return new Maybe(x);
    }
  
    get isNothing() {
      return this.$value === null || this.$value === undefined;
    }
  
    constructor(x) {
      this.$value = x;
    }
  
    map(fn) {
      return this.isNothing ? this : Maybe.of(fn(this.$value));
    }
  
    inspect() {
      return this.isNothing ? 'Nothing' : `Just(${(this.$value)})`;
    }
  }

  function add3(a:number,b:number,c:number){
      return a+b+c;
  }

 let one = add3.bind({},3).bind({},5);



 let curryOne = curry(add3,3);
 let curryTwo = curryOne(5);

 console.log(curryTwo(10),'curry');
  //console.log(add3.length);
  //let two = one(4,4);
  //console.log("this is",two);



  let match = (reg) => (val:any)=> val.match(reg);
  let prop = (prop:any) =>(val) => val[prop];
  let add = (add:any) => (val:any) => val + add;

  console.log(Maybe.of('Malkovich Malkovich').map(match(/a/ig)));
  console.log(Maybe.of(null).map(match(/a/ig))); //Nothing
  console.log(Maybe.of({ name: 'Dinah', age: 14 }).map(prop('age')).map(add(10))); //JUST(24)