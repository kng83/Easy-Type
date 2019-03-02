import { Router, Express } from "express";
import { createDbIndexes, createDbValidators, Validators } from "../model-preparation/validation_creator/validator.builder";
import { CollectionIndex } from "../model-preparation/validation_creator/validator.builder";
import { dbConnected, dbConnection } from "./db";
import { createControllersList, CtrlListType } from "../model-preparation/controller_creator/ctrl.builder";
import setDbRoutes from "../../router/routes";
import { Db } from "mongodb";

export class DbCreator {

  db: Promise<Db> | Db;
  databaseUrl: string;
  databaseName: string;
  controllersList: CtrlListType<any>;
  validatorList: Validators[];
  indexesList: CollectionIndex[];
  routerFunction;
  enable = {
    createValidators: true,
    createIndexes: true,
  };

  static mountApp(app: Express, router: Router) {
    return new DbCreator(app, router);
  }

  constructor(private app: Express, private router: Router) { }

  dbConnect(databaseUrl, databaseName) {
    this.databaseUrl = databaseUrl;
    this.databaseName = databaseName;
    return this;
  }

  createValidators(validatorsList: Validators[], enable: boolean) {
    this.enable.createValidators = enable;
    this.validatorList = validatorsList;
    return this;
  }

  createIndexes(indexesList: CollectionIndex[], enable: boolean) {
    this.enable.createIndexes = enable;
    this.indexesList = indexesList;
    return this;
  }

  //Todo check return type or controllersList type
  createControllers<T>(controllersList: T) {
    this.controllersList = controllersList;
    return this;
  }

  mountDbRoutes(routerFunction: Function) {
    this.routerFunction = routerFunction;
    return this;
  }

  // Every thing is binded here together
  async bind() {
    try {
      this.db = await dbConnection(this.databaseUrl, this.databaseName);

      if (this.enable.createValidators) await createDbValidators(this.validatorList, this.db);
      if (this.enable.createIndexes) await createDbIndexes(this.indexesList, this.db);

      let controllers = createControllersList(this.controllersList, this.db);

      this.routerFunction(this.router, controllers);
    } catch (e) {
      throw new Error("Cannot connect to database!!!");
    }
  }
}

// try {
//   let db = await dbConnected();
//   await createDbValidators(validatorsList, db);
//   await createDbIndexes(indexesList, db);
//
//   let controllers = createControllersList(controllersList, db);
//
//   setDbRoutes(appSet.router, controllers);
//   httpServer.listen(app.get('port'), () => log.info(`listen on port ${app.get('port')} OK`));
// } catch (e) {
//   throw new Error("Cannot connect to database!!!");
//
