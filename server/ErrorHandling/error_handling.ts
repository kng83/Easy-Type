import {IErrorConfig,} from './src/Error.Interface'
import {ErrorModel} from './lib/Error.model';

//export let EM: ErrorModel;

//**Make Global error handling instance for error state management */
export function startErrorHandling(config: IErrorConfig) {
  return ErrorModel.initialize(config);
}

export {IErrorPassingStruct,IErrorData,IErrorConfig} from './src/Error.Interface';
export {checkAgainstUndefined,tryFnRun,asyncTryFnRun} from './src/error.functions';