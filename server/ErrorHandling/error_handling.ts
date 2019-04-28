import {IErrorConfig,} from './src/Error.Interface'
import {ErrorModel} from './lib/Error.Model';

//export let EM: ErrorModel;

//**Make Global error handling instance for error state management */
export function startErrorHandling(config: IErrorConfig) {
   ErrorModel.initialize(config);
}

export {IErrorPassingStruct,IErrorData,IErrorConfig} from './src/Error.Interface';
export {checkAgainstUndefined,tryFnRun,asyncTryFnRun} from './src/error.functions';