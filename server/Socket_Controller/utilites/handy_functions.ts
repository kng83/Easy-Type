/**
   * - Advanced use of recursion
   * - Function pushes value to array in place describe by positions array
   * - Example: mapValueInPositionedArray(arr,'some',1,2) 
   * - will put 'some' tu arr[1][2][0]
*/
function mapValueInPositionedArray(arr: any[][], value, ...positions: number[]) {
    let [pos, ...rest] = [...positions]
    if (rest.length > 0) {
        if (!Array.isArray(arr[pos])) {
            arr[pos] = [];
        }
        arr[pos].push(arr[pos].push(mapValueInPositionedArray(arr[pos], value, ...rest)));
    } else {
        if (!Array.isArray(arr[pos])) {
            arr[pos] = [];
        }
        arr[pos].push(value);
    }
    return arr;
}

//**Function to pass object from arrays using primary key from object like for example email */
function createMap<T>(objArr: T[], primaryObjKey: string) {
    let mapObj = new Map<string, T>();
    objArr.forEach(el => {
        mapObj.set(el[primaryObjKey], el)
    })
    return mapObj;
}

//**Async representation of callback */
function asyncFn(params, callback) {
    setTimeout(function() {
        if (callback) {callback(params);}
    }, 0);
}

