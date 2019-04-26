//TODO make better
//***Socket Demultiplexer */
export class SD<K> {
    //**Create singleton instance */
    public static mountMappingArr<T>(dataArr: T[]) {
        return new SD(dataArr) as Pick<SD<T>, 'setDataArrPrimaryKey'>;
    }
    //**Private variables */
    private _mapper: Map<string, K>;
    private _primaryKey: string;
    private constructor(private readonly _objArr: K[]) { }
    //**Map object to primary key. Primary key is used for router powered by Map key value pairs*/
    public setDataArrPrimaryKey(primaryObjKey: string) {
        this._primaryKey = primaryObjKey;
        return this as any as Pick<SD<K>, 'createMapperObj'>;
    }
    //**Append map key to Instance object. This key will hold converted Mapping Array */
    public createMapperObj() {
        this._mapper = new Map<string, K>();
        this._objArr.forEach(el => {
            this._mapper.set(el[this._primaryKey], el);
        });
        return this as any as Pick<SD<K>, 'mountPayloadObj'>;
    }
    public mountPayloadObj<T, D extends keyof T, W extends {
        [key in D]: Map<string, K>;
    }, Z extends string>(payloadObj: T, targetForMapper: D) {
        //Make copy of payloadObj and replace old property content with new content;
        const { [targetForMapper]: oldProp, ...rest } = { ...payloadObj };
        const newProp = { [targetForMapper]: this._mapper } as {
            [key in D]: Map<string, K>;
        };
        return { ...rest, ...newProp };
    }
}
