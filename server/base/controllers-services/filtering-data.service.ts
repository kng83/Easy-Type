import {DataBaseService} from "./database.service";



export type FilterPattern<Model> = Partial<{ [key in keyof Model]: (value: any) => {} }>;

interface FilterSchema {
  [key: string]: (value: any) => any;
}


//*** Add filter to used collection
export abstract class FilteringDataService extends DataBaseService {

  protected abstract requestFilter: FilterSchema;
  protected abstract responseFilter: FilterSchema;

  //*** Add request filter */
  reqFilter(doc: object, ...excludeProps: string[]) {
    if (this.requestFilter === null || this.requestFilter == undefined) {
      return doc;
    }
    try {
      Object.keys(this.requestFilter).forEach((filterKey: string) => {
        if (!excludeProps.some(excProp => excProp == filterKey)) {
          //   doc[filterKey] = doc[filterKey](doc[filterKey])
          doc[filterKey] = this.requestFilter[filterKey](doc[filterKey]);
        }
      });
      return doc;
    } catch (e) {
      return doc = null;
    }
  }

  //***Filter only single property */
  reqSinglePropFilter(doc: object, prop: string) {
    try {
      return this.requestFilter[prop](doc[prop]);
    } catch (e) {
      return {err: "Prop doesn't exists"};
    }
  }

  //*** Add filter to object response */
  resFilter(doc: object, ...excludeProps: string[]) {
    if (this.responseFilter === null || this.responseFilter == undefined) {
      return doc;
    }
    try {
      Object.keys(this.responseFilter).forEach((filterKey: string) => {
        if (!excludeProps.some(excProp => excProp == filterKey)) {
          doc[filterKey] = this.responseFilter[filterKey](doc[filterKey]);
        }
      });
      return doc;
    } catch (e) {
      return doc = null;
    }
  }
}
