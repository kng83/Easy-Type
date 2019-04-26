//**Create Map Array which contains elements of the same type */
export function createMapFromArr<T extends any>(arr: T[], primaryKey: string): Map<string, T> {
    const mapObj = new Map<string, T>();
    arr.forEach(el => {
        mapObj.set(el[primaryKey], el);
    });
    return mapObj;
}
