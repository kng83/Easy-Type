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

 let one = add3.bind({},3);
 let two = one.bind({},4);
 console.log(two(5) ,"three");

 function curry<T extends any,R extends any[]>(fn:T,...args:R){
     return fn.bind(null,...args); 
 }
 let curryOne = curry(add3,4);
 let curryTwo = curryOne(4);
 console.log(curryTwo(5),'curry');
  //console.log(add3.length);
  //let two = one(4,4);
  //console.log("this is",two);



  let match = (reg) => (val:any)=> val.match(reg);
  let prop = (prop:any) =>(val) => val[prop];
  let add = (add:any) => (val:any) => val + add;

  console.log(Maybe.of('Malkovich Malkovich').map(match(/a/ig)));
  console.log(Maybe.of(null).map(match(/a/ig))); //Nothing
  console.log(Maybe.of({ name: 'Dinah', age: 14 }).map(prop('age')).map(add(10))); //JUST(24)