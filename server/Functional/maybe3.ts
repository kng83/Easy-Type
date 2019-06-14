class Maybe3 {
    private _value
    static of(x) {
      return new Maybe3(x);
    }
  
    get isNothing() {
      return this._value === null || this._value === undefined;
    }
  
    constructor(x) {
      this._value = x;
    }
  
    map(fn) {
      return this.isNothing ? this : Maybe3.of(fn(this._value));
    }
  
    inspect() {
      return this.isNothing ? 'Nothing' : `Just(${this.identity(this._value)})`;
    }
    identity(x){
        return x;
    }
  }

  
  let match3 = (reg) => (val:any)=> val.match(reg);
  let prop3 = (prop:any) =>(val) => val[prop];
  let add3 = (add:any) => (val:any) => val + add;
  let toUpper3 = () => (val: string) => val.toUpperCase();
  let identity3 = x=>x
  let m3 = Maybe3.of('Malkovich Malkovich').map(match3(/a/ig)).map(toUpper3).map(identity3);
  console.log(m3.inspect());
  let m33 =Maybe3.of({ name: 'Dinah', age: 14 }).map(prop3('age')).map(add3(10));
  console.log(m33);
