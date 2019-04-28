import {IErrorConfig} from '../src/Error.Interface';
import {overrideLeft,createUniqueString} from './utilities';



//TODO extract logger from Error handling
export class ErrorModel {
    //**Create singleton instance */
    static initialize(config: IErrorConfig) {
        return ErrorModel._instance || new ErrorModel(config);
    }
    private static _instance: ErrorModel;

    //**Error configuration for logging and stacking */
    private _defaultConfig: IErrorConfig = {
        globalVariableName:'EM',
        errorLevel: 'low',
        noErrorData: {},
        isErrorData: {
            name: 'empty name',
            message: 'empty message',
            stack: 'empty stack'
        }
    }
    private _runtimeConfig: IErrorConfig = {};

    //**Override default values */
    private constructor(config?: IErrorConfig) {
        if (ErrorModel._instance) {
            throw new Error("Error - use Singleton.getInstance()");
        }
        this._runtimeConfig = overrideLeft(this._defaultConfig, config);
        ErrorModel._instance =  this;
    }

    //**Make global variable to hold instance */
    private makeGlobalVariableToHoldInstance(){
        global[createUniqueString('xyz')] = this;
    }

    //**Get error level config */
    public static get errorConfig() {
        return ErrorModel._instance._runtimeConfig;
    }
    //** Get ErrorData model without errors*/
    public static get noErrorDataModel() {
        return ErrorModel._instance._runtimeConfig.noErrorData;
    }
    //**Get ErrorData model with errors */
    public static get isErrorDataModel() {
        return ErrorModel._instance._defaultConfig.isErrorData;
    }
}
