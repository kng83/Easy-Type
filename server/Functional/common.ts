
export let match = (reg) => (val: string) => val.match(reg);
export let prop = (prop: any) => (val) => val[prop];
export let add = (add: number) => (val: number) => val + add;
export let toString = (val:any)=>val.toString();
export let toUpper = (val: string) => val.toString().toUpperCase();
export let strAdd = (addString: string) => (val) => addString + val;
export let append = (str:string)=>val =>str + '' +val ;
export const identity = x => x;
export let tap = (val: any) => { console.log(val); return val; }

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
export function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}
export const map = curry((fn, f) => f.map(fn));
// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
export const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// either :: (a -> c) -> (b -> c) -> Either a b -> c
export const either = curry((f, g, e) => {
  if (e.isLeft) {
    return f(e.$value);
  }

  return g(e.$value);
});

// inspect :: a -> String
export const inspection = (x) => {
  if (x && typeof x.inspect === 'function') {
    return x.inspect();
  }

  function inspectFn(f) {
    return f.name ? f.name : f.toString();
  }

  function inspectTerm(t) {
    switch (typeof t) {
      case 'string':
        return `'${t}'`;
      case 'object': {
        const ts = Object.keys(t).map(k => [k, inspection(t[k])]);
        return `{${ts.map(kv => kv.join(': ')).join(', ')}}`;
      }
      default:
        return String(t);
    }
  }

  function inspectArgs(args) {
    return Array.isArray(args) ? `[${args.map(inspection).join(', ')}]` : inspectTerm(args);
  }

  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
};

// split :: String -> String -> [String]
//export const split = curry((sep, str:string) => str.split(sep));
export const split = (sep:string) => (str:string) => str.toString().split(sep);

// head :: [a] -> a
export const head = xs => xs[0];