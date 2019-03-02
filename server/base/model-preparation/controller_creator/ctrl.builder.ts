import {ErrorLayer} from "../../controllers/error.layer";
import {Db} from "mongodb";


// *** Bind controllers controllers-services in order to remove db parameter from function
export function bindedCtrlServices<T extends any,
  K extends { [Key in keyof T]: (db: Db) => InstanceType<T[Key]> },
  L extends { [Key in keyof T]: InstanceType<T[Key]> }>(servicesObj: T) {
  const output = {} as K | L;  // should be only K;
  // tslint:disable-next-line:forin
  for (const k in servicesObj) {
    output[k] = servicesObj[k].makeInstance.bind(servicesObj[k]); // egz.: UserService.bind.makeInstance(UserService);
  }
  return output;
}

// *** Build controllers instance
function buildCtrlInstance(ctrlClass, services, db) {
  const serviceWithDb = [];
  services.forEach(service => {
    serviceWithDb.push(service(db));
  });
  return ErrorLayer.wrapInstance(ctrlClass.makeInstance(...serviceWithDb));

}

// *** Create list controllers List for route handling
// !!!Warning changes for in statement
// @ts-ignore
export function createControllersList<T extends any,
  D extends { [Key in keyof T]: ReturnType<T[Key]> }>(controllers: T, db: Db | Promise<Db>): D {
  const controllersList = {} as D;
  for (const controller in controllers) {
    if (controllers.hasOwnProperty(controller)) {
      controllersList[controller] = controllers[controller](db);
    }
  }
  return controllersList;
}


// *** Create binded  ctrl. Ctrl(db)=> true ctrl
// @ts-ignore
// @ts-ignore
export function createBindedCtrl<B extends (db: Db) => T extends new (...args: any[]) => infer R ? R : any,
  T extends new (...args: W) => any,
  W extends any[]>(ctrlClass: T, ...services: W): B {
  return buildCtrlInstance.bind(null, ctrlClass, services);
}

// *** Type needed for rotehandler
export type CtrlListType<D> = {
  [Key in keyof D]: D extends (...args: any[]) =>
    infer R ? R : D[Key] extends (...args: any[]) =>
    infer U ? U : any
};
