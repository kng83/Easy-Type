import { Data } from "ws";

let INSTANCE_ERROR: ErrorHandling;

interface NError {
    err: boolean | undefined;
    errorData?: ErrorData
}
interface ErrorData extends Partial<Error> {
    caller?: string | any;
}

/** Error Level expanation:
    * 'none' - without error logginh 
    * 'low' - only message is logged
    * 'caller' - message and caller if exists is logged
    * 'stack' - with message is logged
    * 'full' -  name message and stack is logged
*/
type ErrorLevel = 'none' | 'low' | 'caller' | 'stack';

interface ErrorConfig {
    errorLevel: ErrorLevel
}

class ErrorHandling {
    //**Create singleton instance */
    public static initialize(config: ErrorConfig) {
        return new ErrorHandling(config)
    }

    //**Error configuration for logging and stacking */
    private _config: ErrorConfig = {
        errorLevel: 'low'
    }

    private _defaultError: ErrorData = {
        name: '',
        caller: '',
        message: '',
        stack: ''
    }

    private constructor(private config?: ErrorConfig) {
        this._override(config, this._config);
        return this;
    }
    //***Override existing object with fixed values  */
    private _override<R,T>(source: R,target:T) {
        Object.keys(source).forEach((key) => {
             target[key] = source[key]
        })
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

    public error(errorData: ErrorData): NError {
        return {
            err: true,
            errorData
        }
    }
    public noError(): NError {
        return {
            err: false,
        }
    }

    public throwCustomError(message: string, caller?: any) {

        let err: ErrorData = {...this._defaultError};
        if (this._config.errorLevel === 'stack') {
            try {
                throw Error(message)
            } catch (e) {
                this._override(err,e);
            }
        }
        return err;
    }
}

export function startErrorHandling(config: ErrorConfig) {
    INSTANCE_ERROR = ErrorHandling.initialize(config);
}

export function checkForUndefined(value, fn) {
    if (value) {
        return INSTANCE_ERROR.noError();
    } else {

        return INSTANCE_ERROR.error({ message: 'value is undefined', stack: '', caller: fn })
    }

}

export function tryValaue(value) {
    let v = value;
    try {
        throw Error(`${value} is null`)
    } catch (e) {
        console.log(e)
    }

}