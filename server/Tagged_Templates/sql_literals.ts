
export function sql<T extends { map: any }>(strings: T, ...values) {
    let str = '';
    strings.map((s, i) => {
        str += s + (values[i] || '');
    });
    return str as any as T;
}