import {match,prop,identity,strAdd,toUpper} from './common';

class Either {
    protected _value;
    static of(x) {
      return new Right(x);
    }
  
    constructor(x) {
      this._value = x;
    }
    identify(x){
        return x;
    }
  }
  
  class Left extends Either {
    map(f) {
      return this;
    }
  
    check() {
      return `Left(${this.identify(this._value)})`;
    }
  }
  
  class Right extends Either {
    
    map(f) {
      return Either.of(f(this._value));
    }
  
    check() {
      return `Right(${this.identify(this._value)})`;
    }
  }
  
 