
class Maybe3 {
    private _value;
    private _count =0;
    static of(x) {
      return new Maybe3(x);
    }
  
    get isNothing() {
      return this._value === null || this._value === undefined;
    }
  
    constructor(x) {
      this._count++;
      this._value = x;
    }
  
    map(fn) {
      return this.isNothing ? this : Maybe3.of(fn(this._value));
    }
  
    check() {
      return this.isNothing ? 'Nothing' : `Just(${this.identity(this._value)})`;
    }
    identity(x){
        return x;
    }
    referenceCounter(){
      return this._count;
    }
  }

  
  let match3 = (reg) => (val:string)=> val.match(reg);
  let prop3 = (prop:any) =>(val) => val[prop];
  let add3 = (add:any) => (val:any) => val + add;
  let toUpper3 = (val: string) => val.toString().toUpperCase();
  let strAdd =  (addString:string)=> (val) => addString + val;
  let identity3 = x=>x;
  let tap = (val:any)=>{console.log(val);return val;}


  let m3 = Maybe3.of('Malkovich Malkovich')
  .map(match3(/alk/ig))
  .map(tap)
  .map(toUpper3)
  .map(strAdd('some'));
  console.log(m3);
  console.log('ref counter',m3.referenceCounter());

  let m33 =Maybe3.of({ name: 'Dinah', age: 14 }).map(prop3('age')).map(add3(10));
  console.log(m33);
