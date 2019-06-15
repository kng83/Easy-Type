import { match, add, map, prop, identity, strAdd, toUpper, compose, curry, append,toString,tap,either} from './common';
import  moment from 'moment';


class Either {
  protected _value;
  static of(x) {
    return new Right(x);
  }

  constructor(x) {
    this._value = x;
  }
  identify(x) {
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

//this function is important !!! for future conversions
const left = x => new Left(x);

let right1 = Either.of('rain').map(str => `b${str}`);
console.log(right1);
// Right('brain')

let left1 = left('rain').map(str => `It's gonna ${str}, better bring your umbrella!`);
console.log(left1);
// Left('rain')

let right2 = Either.of({ host: 'localhost', port: 80 }).map(prop('host'));
console.log(right2);
// Right('localhost')

let left2 = left('rolls eyes...').map(prop('host'));
console.log(left2);

// Left('rolls eyes...')

//----------------------------------
// fortune :: Number -> String
// tu jest wazna konstrukacja sprawdzenie czy jest dobrze i zwracana jest Right lub left
//isValid to metoda obiektu zwracanego przez moment
const getAge = curry((dataNow, user) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD');
  return birthDate.isValid()
    ? Either.of(dataNow.diff(birthDate, 'years'))
    : left('Birth date could not be parsed');
});

const fortune = compose(append('If you survive, you will be '), toString, add(1));

// zoltar :: User -> Either(String, _)
const zoltar = compose(tap, map(fortune), getAge(moment()));

let zRight = zoltar({ birthDate: '2005-12-12' });
// 'If you survive, you will be 10'
// Right(undefined)
console.log('Zoltar Right', zRight);

let zLeft = zoltar({ birthDate: 'balloons!' });
// Left('Birth date could not be parsed')
console.log('Zoltar Left ',zLeft);

//-------------------with either function

//pass the wrong value to console
const zoltar1 = compose(console.log, either(identity, fortune), getAge(moment()));

zoltar({ birthDate: '2004-12-12' });
// 'If you survive, you will be 15'
// undefined

zoltar({ birthDate: 'balloons!' });
// 'Birth date could not be parsed'
// undefined