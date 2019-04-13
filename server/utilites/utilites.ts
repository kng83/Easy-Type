
//** Implementation of pipe*/
export const pipe = <T>(fn1: (a: T) => T, ...fns: {(a: T) : T}[]) =>
fns.reduce((accFn, nextFn) => passValue => nextFn(accFn(passValue)), fn1);