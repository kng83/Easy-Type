
let INSTANCE_ERROR:ErrorHandling;

interface NError{
    err:boolean | undefined;
    desc:string;
    errorData:ErrorData
}
interface ErrorData{
    caller:any;
    stack:any
}

class ErrorHandling{
    //**Create singleton instance */
    public static initialize(config){
        return new ErrorHandling(config)
    }

    constructor(private config){}   

    error(desc:string,errorData:ErrorData):NError{
        return {
            err:true,
            desc,
            errorData
        }
    }
    noError():NError{
        return {
            err:false,
            desc:'',
            errorData:{caller:'',stack:''}
        }
    }
}

export function startErrorHandling(config){
    INSTANCE_ERROR = ErrorHandling.initialize(config);
}

export function checkForUndefined(value,fn){//
  if(value){
        return INSTANCE_ERROR.noError();
  }else{
      return INSTANCE_ERROR.error('value is undefined',{stack:'',caller:fn})
  }
    
}

export function tryCatch(value){//
    console.log(arguments)
    try{
        throw Error(`${value} is null`)
    }catch(e){
        console.log(e)
    }
    
}