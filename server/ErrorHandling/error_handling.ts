import { overrideRight, mergeRight } from './lib/override';

let EI: ErrorInstance;

export interface ErrorPassingObj {
    hasError: boolean | undefined;
    errorData?: ErrorData
}
//interface ErrorData extends Partial<Error> 
interface ErrorData {
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
type ErrorLevel = 'none' | 'low' | 'caller' | 'stack';

interface ErrorConfig {
    errorLevel?: ErrorLevel,
    noErrorObj?: ErrorPassingObj,
    isErrorObj?: ErrorPassingObj
}

//TODO extract logger from Error handling
class ErrorInstance {
    //**Create singleton instance */
    static initialize(config: ErrorConfig) {
        return new ErrorInstance(config)
    }

    //**Error configuration for logging and stacking */
    private _defaultConfig: ErrorConfig = {
        errorLevel: 'low',
        noErrorObj: {
            hasError: false,
            errorData:{}
        },
        isErrorObj: {
            hasError: true,
            errorData: {
                name: 'empty name',
                message: 'empty message',
                stack: 'empty stack'
            }
        }
    }
    private _runtimeConfig:ErrorConfig ={};

     //**Override default values */
    private constructor(config?: ErrorConfig) {
        overrideRight(this._runtimeConfig,this._defaultConfig, config);
        console.log(this._runtimeConfig);
        return this;
    }
    //**Get error level config */
    public get errorConfig() {
        return this._runtimeConfig;
    }
    //** Get ErrorData model without errors*/
    public get noErrorDataModel(){
        return this._runtimeConfig.noErrorObj.errorData;
    }
    //**Get ErrorData model with errors */
    public get isErrorDataModel(){
        return this._defaultConfig.isErrorObj.errorData;
    }

    //** */
    public formIsErrorObj(errorData: ErrorData): ErrorPassingObj {
        return {
            hasError: this._runtimeConfig.isErrorObj.hasError,
            errorData
        }
    }
    //** This is used when good error object is needed*/
    public formNoErrorObj(): ErrorPassingObj {
        return {
            hasError: this._runtimeConfig.noErrorObj.hasError,
            errorData: this._runtimeConfig.noErrorObj.errorData
        }
    }
}

//**Make Global error handling instance for error state management */
export function startErrorHandling(config: ErrorConfig) {
    EI = ErrorInstance.initialize(config);
}

function throwUserError(message: string) {
    let err: ErrorData = EI.isErrorDataModel;

    if (EI.errorConfig.errorLevel === 'stack') try {
        throw Error(message)
    } catch (e) {
        err = errorResolver(e);
    } else {
        err = mergeRight(err, { message })
    }
    return err;
}

//**Check undefined value */
export function checkAgainstUndefined(value) {
    if (value) return EI.formNoErrorObj();
    else {
        const e = throwUserError('value is undefined')
        return EI.formIsErrorObj(e)
    }
}

//**Run function in safe environment and return error object if occurs*/
export function tryFnRun<D extends any[], R>(fn: { (...args: D): R }, ...args: D): [R, ErrorPassingObj] {
    let ans: R, passErrObj = EI.formNoErrorObj();
    try {
        ans = fn(...args);
    } catch (e) {
        passErrObj = EI.formIsErrorObj(errorResolver(e));
    }
    return [ans, passErrObj];
}

//**Function to write async task in safety environment fn should by async */
export async function asyncTryFnRun<D extends any[], R>(fn: { (...args: D): R }, ...args: D): Promise<[R, ErrorPassingObj]> {
    let ans: R, passErrObj = EI.formNoErrorObj();
    try {
        ans = fn(...args);
    } catch (e) {
        const errorData = errorResolver(e);
        passErrObj = EI.formIsErrorObj(errorData);
    }
    return [await ans, await passErrObj];
}

//**Resolve error and put to ErrorData object */
function errorResolver({ name, message, stack }: Error): ErrorData {
    return { name, message, stack: convertErrStack(stack) }
}

//**Convert error stack for better view */
function convertErrStack(errStack: string) {
    //make this simpler s{2,} means to or more spaces 
    let s = errStack.match(/(?<=\n\s+at\s+).*?(?=\s+at)/g);
    let sArr = [];
    s.forEach(el => {
        sArr.push(el);
    })
    return sArr;
}

//***Switch between logging options */
function logError({ name, message, stack }: ErrorData) {
    switch (EI.errorConfig.errorLevel) {
        case 'none': break;
        case 'low': console.log(message); break;
        case 'caller': console.log(name, stack); break;
        case 'stack': console.log(name, message, stack); break;
        default: ;
    }
}
