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
