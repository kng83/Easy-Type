//** Implementation of asyncPipe based on @types/rampda*/

type AsyncFunction <I,O> = (inputs:I) => Promise<O> 
// export async function asyncPipe<V0, T1>(
//     fn0: (x0: V0) => T1): {(x0: V0): Promise<T1>}


export async function asyncPipe<V0, T1, T2>(
    fn0: (x0: V0) => Promise<T1>,
    fn1: (x: Promise<T1>) => T2):(x0:T2) => Promise<T2>
// export async function asyncPipe<V0, Promise<T1>, Promise<T2>, Promise<T3>>(
//     fn0: (x0: V0) => Promise<T1>,
//     fn1: (x: Promise<T1>) => Promise<T2>,
//     fn2: (x: Promise<T2>) => Promise<T3>): (x0: V0) => Promise<Promise<T3>>
// export async function asyncPipe<V0, Promise<T1>, Promise<T2>, Promise<T3>, Promise<T4>>(
//     fn0: (x0: V0) => Promise<T1>,
//     fn1: (x: Promise<T1>) => Promise<T2>,
//     fn2: (x: Promise<T2>) => Promise<T3>,
//     fn3: (x: Promise<T3>) => Promise<T4>): (x0: V0) => Promise<Promise<T4>>

// export async function asyncPipe<V0, Promise<T1>, Promise<T2>, Promise<T3>, Promise<T4>, Promise<T5>>(
//     fn0: (x0: V0) => Promise<T1>,
//     fn1: (x: Promise<T1>) => Promise<T2>,
//     fn2: (x: Promise<T2>) => Promise<T3>,
//     fn3: (x: Promise<T3>) => Promise<T4>,
//     fn4: (x: Promise<T4>) => Promise<T5>): (x0: V0) => Promise<Promise<T5>>

// export async function asyncPipe<V0, Promise<T1>, Promise<T2>, Promise<T3>, Promise<T4>, Promise<T5>, Promise<T6>>(
//     fn0: (x0: V0) => Promise<T1>,
//     fn1: (x: Promise<T1>) => Promise<T2>,
//     fn2: (x: Promise<T2>) => Promise<T3>,
//     fn3: (x: Promise<T3>) => Promise<T4>,
//     fn4: (x: Promise<T4>) => Promise<T5>,
//     fn5: (x: Promise<T5>) => Promise<T6>): (x0: V0) => Promise<Promise<T6>>

// export async function asyncPipe<V0, Promise<T1>, Promise<T2>, Promise<T3>, Promise<T4>, Promise<T5>, Promise<T6>, Promise<T7>>(
//     fn0: (x0: V0) => Promise<T1>,
//     fn1: (x: Promise<T1>) => Promise<T2>,
//     fn2: (x: Promise<T2>) => Promise<T3>,
//     fn3: (x: Promise<T3>) => Promise<T4>,
//     fn4: (x: Promise<T4>) => Promise<T5>,
//     fn5: (x: Promise<T5>) => Promise<T6>,
//     fn6: (x: Promise<T6>) => Promise<T7>): (x0: V0) => Promise<Promise<T7>>

// export async function asyncPipe<V0, Promise<T1>, Promise<T2>, Promise<T3>, Promise<T4>, Promise<T5>, Promise<T6>, Promise<T7>, Promise<T8>>(
//     fn0: (x0: V0) => Promise<T1>,
//     fn1: (x: Promise<T1>) => Promise<T2>,
//     fn2: (x: Promise<T2>) => Promise<T3>,
//     fn3: (x: Promise<T3>) => Promise<T4>,
//     fn4: (x: Promise<T4>) => Promise<T5>,
//     fn5: (x: Promise<T5>) => Promise<T6>,
//     fn6: (x: Promise<T6>) => Promise<T7>,
//     fn7: (x: Promise<T7>) => Promise<T8>): (x0: V0) => Promise<Promise<T8>>
// export async function asyncPipe<V0, Promise<T1>, Promise<T2>, Promise<T3>, Promise<T4>, Promise<T5>, Promise<T6>, Promise<T7>, Promise<T8>, Promise<T9>>(
//     fn0: (x0: V0) => Promise<T1>,
//     fn1: (x: Promise<T1>) => Promise<T2>,
//     fn2: (x: Promise<T2>) => Promise<T3>,
//     fn3: (x: Promise<T3>) => Promise<T4>,
//     fn4: (x: Promise<T4>) => Promise<T5>,
//     fn5: (x: Promise<T5>) => Promise<T6>,
//     fn6: (x: Promise<T6>) => Promise<T7>,
//     fn7: (x: Promise<T7>) => Promise<T8>,
//     fn8: (x: Promise<T8>) => Promise<T9>): (x0: V0) => Promise<T9>
// export async function asyncPipe<V0, Promise<T1>, Promise<T2>, Promise<T3>, Promise<T4>, Promise<T5>, Promise<T6>, Promise<T7>, Promise<T8>, Promise<T9>, T10>(
//     fn0: (x0: V0) => Promise<T1>,
//     fn1: (x: Promise<T1>) => Promise<T2>,
//     fn2: (x: Promise<T2>) => Promise<T3>,
//     fn3: (x: Promise<T3>) => Promise<T4>,
//     fn4: (x: Promise<T4>) => Promise<T5>,
//     fn5: (x: Promise<T5>) => Promise<T6>,
//     fn6: (x: Promise<T6>) => Promise<T7>,
//     fn7: (x: Promise<T7>) => Promise<T8>,
//     fn8: (x: Promise<T8>) => Promise<T9>,
//     fn9: (x: Promise<T9>) => Promise<T10>): (x0: V0) => Promise<T10>

export  async function asyncPipe<T extends any[],K>(...args:T) {
    return async(value:Promise<K>) => {
        let fn = args[0](value)
        for (let i = 0; i < args.length; i++) {
            fn = args[i](fn)
        }
        return fn
    }

} 

//async ( async ( async(value)))