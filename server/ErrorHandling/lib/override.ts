

/**Function which takes copy of pattern obj and overrides this object with other objects from left to right
 * Objects from sources must have the same keys as patternObj 
 * Most important is the last right object
*/
export function overrideRight<R extends Partial<T>[], T extends {}>(overrideObj: T, ...sources: R) {
    for(let i=0;i<sources.length;i++){
        for(let key in sources[i]){
            overrideObj[key] = sources[i][key]
        }
    }
}

//** merge object to the right. Most important is the last right object*/
export function mergeRight<T extends D[],D extends any>(...sources:T){
    return Object.assign({},...sources);
    
}
