//Option
class Maybe {
    static just(a) {
        return new Just(a);
    }
    static nothing() {
        return new Nothing();
    }
    static fromNullable(a) {
        return a !== null ? Maybe.just(a) : Maybe.nothing();
    }
    static of(a) {
        return Maybe.just(a);
    }
    get isNothing() {
        return false;
    }
    get isJust() {
        return false;
    }
};
//Some
class Just extends Maybe {
    private _value;
    constructor(value) {
        super();
        this._value = value;
    }

    get value() {
        return this._value;
    }

    map(f) {
        return Maybe.fromNullable(f(this._value));
    }

    chain(f) {
        return f(this._value);
    }

    getOrElse() {
        return this._value;
    }

    filter(f?) {
        exports.Maybe.fromNullable(f(this._value) ? this._value : null);
    }

    get isJust() {
        return true;
    }

    toString() {
        return `Maybe.Just(${this._value})`;
    }
};
//None
class Nothing extends Maybe {
    private _value;
    map(f) {
        return this;
    }
    chain(f) {
        return this;
    }
    get value() {
        throw new TypeError("Nie można pobrać wartości obiektu typu Nothing.");
    }
    getOrElse(other) {
        return other;
    }
    filter() {
        return this._value;
    }
    get isNothing() {
        return true;
    }
    toString() {
        return 'Maybe.Nothing';
    }
};

let match2 = (reg) => (val: any) => val.match(reg);
let toUpper2 = () => (val: string) => val.toUpperCase();
let identity2 = (x) => x;

//test
let some2 = Maybe.of("Czesc").map(match2(/cze/gi));
console.log(some2);