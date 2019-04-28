
export interface IErrorPassingStruct {
    hasError: boolean | undefined;
    errorData?: IErrorData
}
//interface ErrorData extends Partial<Error> 
export interface IErrorData {
    name?: string;
    message?: string;
    stack?: string | string[];
}

/** Error Level explanation:
    * 'none' - without error login
    * 'low' - only message is logged
    * 'caller' - message and caller if exists is logged
    * 'stack' - message with stack  is logged
*/
export type TErrorLevel = 'none' | 'low' | 'caller' | 'stack';

export interface IErrorConfig {
    globalVariableName?:string,
    errorLevel?: TErrorLevel,
    noErrorData?: IErrorData,
    isErrorData?: IErrorData
}