
/***Function used for embedded  sql highlighting
 * add single quote (mssql needs them)
*/ 
// export function sql<T extends { map: any }>(strings: T, ...values) {
    
//     let str = strings[0];
//     values.map((value, i) => {
//     str += ("'" + value + "'") + strings[i + 1];
//     });
//     return str as any as T;
// }

 export function sql<T extends { map: any }>(strings: T, ...values) {
    
    let str = strings[0];
    values.map((value, i) => {
    str += ( value ) + strings[i + 1];
    });
    return str as any as T;
}

export function s(str:string){
    return `'${str}'`
}