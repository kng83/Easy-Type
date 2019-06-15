import { match, add, map, prop, identity, strAdd, toUpper, compose, curry, append,toString,tap,either} from './common';

class Container {
    private $value;
    constructor(x) {
      this.$value = x;
    }
  
    static of(x) {
      return new Container(x);
    }
  }
  console.log(Container.of(3)); //Container { '$value': 3 }
  console.log(Container.of(Container.of({ name: 'yoda' }))); //Container { '$value': Container { '$value': { name: 'yoda' } } }

  const mapper =  (f) => (value) => Container.of(f(value));
  let upperCase = compose(tap, mapper(toUpper));
  upperCase("bobo");