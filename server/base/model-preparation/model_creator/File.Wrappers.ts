//*** Wrap payload into class */
export function classWrapper(className: string, payload: string) {
    return `export class ${className} {
            ${payload}
            \r}`;
}

export function objWrapper(objName: string, payload: string) {
    return `export const ${objName}={
    \r${payload}}`;
}

export function interfaceWrapper(interfaceName: string, payload: string) {
    return `export interface ${interfaceName}{
        \r${payload}}`;
}
