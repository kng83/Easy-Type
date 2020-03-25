import { Request, Response } from "express";

export function tryCatchWrap<T extends any>(object: T): T {
  //** Wrapper against object */
  for (let method in object) {
    let oldMethod = object[method];
    object[method] = (req: Request, res: Response) => {
      oldMethod(req, res)
        .then(data => res.send(data))
        .catch(e => res.send(e.message));
    };
  }
  return object;
  
}

export function log(...text:any[]){
    console.log(...text);
}


//** To detect if key's are on the list */
export function checkIfAllValuesExist<T extends any[]>(msg: string, ...values: T) {
  if (values.some(value => value === null || value === undefined)) {
      throw new Error(msg);
  }
}
