
let EI: ErrorHandling;

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
    public overrideOne<R extends Partial<T>, T>(target: T, source: R) {
        Object.keys(source).forEach((key) => {
            target[key] = source[key]
        })
    }
    public mergeLeft<R extends Partial<T>[], T>(pattern:T,...source:R):T{
        return Object.assign({},pattern,...source) as T;
    }

    public override<R extends Partial<T>[], T extends Object>(target:T,...source:R){
        Object.assign(target,...source);
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
    public get defaultErrObj(){
        return this._defaultError;
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
            errorData:this._defaultError
        }
    }

    //*** Throw error when stack tracing is enabled config:{errorLevel:stack} */
    public throwUserError(message: string, caller?: Function | string) {
        let err: ErrorData = this._defaultError;
        if (this._config.errorLevel === 'stack') {
            try {
                throw Error(message)
            } catch (e) {
                let eee:Error;
                eee = e;
                console.log('ee');
              //  EI.override(err, e as Error,{caller});
            }
        } else {
            err = this.mergeLeft(err,{message,caller})
        }
        return err;
    }
}

//**Make Global error handling instance for error state management */
export function startErrorHandling(config: ErrorConfig) {
    EI = ErrorHandling.initialize(config);
}

//** */
export function checkForUndefined(value, fn) {
    if (value) {
        return EI.noError();
    } else {
        return EI.error( EI.throwUserError('value is undefined',fn))
    }
}

export function checkAgainstUndefined(value) {
    if (value) {
        return EI.noError();
    } else {
        return EI.error( EI.throwUserError('value is undefined'))
    }
}

//** */
export function tryFnReturn<T extends Function,D extends any[],R>(fn:{(...args:D):R},...args:D):[R,  ErrPassingObj]{
    let ans:R; 
    let passErrObj = EI.noError();
    try {
        //f= fn.apply(null,args)
        ans = fn(...args);
    } catch (e){
        //passErrObj = EI.error(EI.mergeLeft(EI.defaultErrObj,e,{caller:fn}))
        passErrObj = EI.error(e)
    }
    return [ans,passErrObj];
}