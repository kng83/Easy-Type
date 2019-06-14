
class Wrapper {
    private _value;
    constructor(value) {
        this._value = value;
    }
    static of(a) {
        return new Wrapper(a);
    }
    map(f) {
        return Wrapper.of(f(this._value));
    }
    join() {
        if (!(this._value instanceof Wrapper)) {
            return this;
        }
        return this._value.join();
    }
    toString() {
        return `Wrapper (${this._value})`;
    }
}
let match = (reg) => (val: any) => val.match(reg);
let toUpper = () => (val: string) => val.toUpperCase();
let identity = (x) => x;

//test
let some = Wrapper.of("Czesc").map(match(/cz/gi)).join().map(identity);
let me = some;
console.log(me.toString());