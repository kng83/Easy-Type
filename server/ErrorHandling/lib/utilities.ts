

//**Override copy of patternObj using sources Array. Array is read from left to right. Override copy is returned*/
export function overrideRight<R extends Partial<T>[], T extends {}>(patternObj: T, ...sources: R) {
    const overrideObj = { ...patternObj }
    for(let i=0;i<sources.length;i++){
        for(let key in sources[i]){
            overrideObj[key] = sources[i][key]
        }
    }
    return overrideObj;
}

//**Override copy of patternObj using sources Array. Array is read from read to left. Override copy is returned*/
export function overrideLeft<R extends Partial<T>[], T extends {}>(patternObj: T, ...sources: R) {
    const overrideObj = { ...patternObj }
    for (let i = sources.length - 1; i >= 0; i--) {
      for (let key in sources[i]) {
        overrideObj[key] = sources[i][key]
      }
    }
    return overrideObj;
  }
  
//**Merge object to the right. Most important is the last right object*/
export function mergeRight<T extends D[],D extends any>(...sources:T){
    return Object.assign({},...sources);
    
}

//**Merge object from left to right. Most important is the first object */
 export function mergeLeft<T extends D[],D extends any>(...sources:T){
    return Object.assign({},...(sources.reverse()));
    
}

//**Get unique string with added secret */
export function createUniqueString(secret):string{
  return Date.now().toString() + secret
}