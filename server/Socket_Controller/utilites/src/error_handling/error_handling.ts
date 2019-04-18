
let INSTANCE_ERROR: ErrorHandling;

export interface ErrPassingObj {
    err: boolean | undefined;
    errorData?: ErrorData
}
interface ErrorData extends Partial<Error> {
    caller?: string | any;
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
    private get _defaultError(): ErrorData {
        return {
            name: '',
            caller: '',
            message: '',
            stack: ''
        }
    }
    //**Override default values */
    private constructor(private config?: ErrorConfig) {
        this.override(this._config, this.config);
        return this;
    }
    //**Override existing object with fixed values  */
    public override<R extends Partial<T>, T>(target: T, source: R) {
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

    //** */
    public error(errorData: ErrorData): ErrPassingObj {
        return {
            err: true,
            errorData
        }
    }

    //** */
    public noError(): ErrPassingObj {
        return {
            err: false,
        }
    }

    //*** Throw error when stack tracing is enabled config:{errorLevel:stack} */
    public throwUserError(message: string, caller?: unknown) {
        let err: ErrorData = this._defaultError;
        if (this._config.errorLevel === 'stack') {
            try {
                throw Error(message)
            } catch (e) {
                this.override(err, e as Error);
                this.override(err, { caller });
            }
        } else {
            this.override(err, { message, caller })
        }
        return err;
    }
}

//**Make Global error handling instance for error state management */
export function startErrorHandling(config: ErrorConfig) {
    INSTANCE_ERROR = ErrorHandling.initialize(config);
}

//** */
export function checkForUndefined(value, fn) {
    if (value) {
        return INSTANCE_ERROR.noError();
    } else {
        return INSTANCE_ERROR.error( INSTANCE_ERROR.throwUserError('value is undefined',fn))
    }
}

//** */
export function tryFnReturn<T,D>(fn:T,...args:D[]):ReturnType<T> | ErrorData {
    let f:ReturnType<T>;
    let err: ErrorData;
    try {
        f = fn(...args);
    } catch (e) {
        INSTANCE_ERROR.override(err,e);
        INSTANCE_ERROR.error(err);
    }
    return f;
}