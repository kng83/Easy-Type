import {overrideRight, mergeRight} from './lib/override';

let EI: ErrorHandling;

export interface ErrPassingObj {
    err: boolean | undefined;
    errorData?: ErrorData
}
//interface ErrorData extends Partial<Error> 
interface ErrorData {
    caller?: string | any;
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
    errorLevel: ErrorLevel
}


//TODO extract logger from Error handling
class ErrorHandling {
    //**Create singleton instance */
    static initialize(config: ErrorConfig) {
        return new ErrorHandling(config)
    }

    //**Error configuration for logging and stacking */
    private _config: ErrorConfig = {
        errorLevel: 'low'
    }


    //*** Getter i used to prevent mutation */
    private get _defaultErrorData(): ErrorData {
        return {
            name: '',
            caller: '',
            message: '',
            stack: ''
        }
    }
    //**Override default values */
    private constructor(config?: ErrorConfig) {
        overrideRight(this._config, config);
        return this;
    }
    
    //***Switch between logging options */
    public logError(e: ErrorData) {
        switch (this._config.errorLevel) {
            case 'none': break;
            case 'low': console.log(e.message); break;
            case 'caller': console.log(e.message, e.caller); break;
            case 'stack': console.log(e.name, e.message, e.stack); break;
            default: ;
        }
    }
    

    //** */
    public error(errorData: ErrorData): ErrPassingObj {
        return {
            err: true,
            errorData
        }
    }

    //** This is used when good error object is needed*/
    public noError(): ErrPassingObj {
        return {
            err: false,
            errorData: this._defaultErrorData
        }
    }

    //*** Throw error when stack tracing is enabled config:{errorLevel:stack} */
    public throwUserError(message: string, caller?: Function | string) {
        let err: ErrorData = this._defaultErrorData;

        if (this._config.errorLevel === 'stack') {
            try {
                throw Error(message)
            } catch (e) {
                err = mergeRight(errorResolver(e), { caller });
                console.log(err,e,'ssssssssssssssssssss');
            }   
        } else {
            console.log(err,'throwUserError');
            err = mergeRight(err, { message, caller })
        }
        return err;
    }
}

//**Make Global error handling instance for error state management */
export function startErrorHandling(config: ErrorConfig) {
    EI = ErrorHandling.initialize(config);
}

//**Check undefined value */
export function checkAgainstUndefined(value) {
    console.log(value);
    if (value) {
        return EI.noError();
    } else {
        const e =EI.throwUserError('value is undefined')
        console.log(e);
        return EI.error(e)
    }
}

//**Run function in safe environment and return error object if occurs*/
export function tryFnRun<D extends any[], R>(fn: { (...args: D): R }, ...args: D): [R, ErrPassingObj] {
    let ans: R;
    let passErrObj = EI.noError();
    try {
        ans = fn(...args);
    } catch (e) {
        passErrObj = EI.error(errorResolver(e));
    }
    return [ans, passErrObj];
}

//**Function to write async task in safety environment */
export async function asyncTryFnRun<D extends any[], R>(fn: { (...args: D): R }, ...args: D): Promise<[R, ErrPassingObj]> {
    let ans: R;
    let passErrObj = EI.noError();
    try {
        ans = fn(...args);
    } catch (e) {
        passErrObj = EI.error(errorResolver(e));
    }
    return [await ans, await passErrObj];
}

//**Resole error and put to ErrorData object */
function errorResolver(e: Error): ErrorData{
    let errName = e.name;
    let errMessage = e.message;
    let errStack = convertErrStack(e.stack);

    return {
            name: errName,
            message: errMessage,
            caller: '',
            stack: errStack
    }
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

