import {validateCollection, createIndex} from './validation.tools';
import {JSONSchema} from '../model_creator/JSON.Schema';



//*** Pass validator array;
export async function createDbValidators(validators: Validators[], db) {
    for (let validator of validators) {
        await validateCollection(db, validator.collectionName, validator.validationModel);
    }
}

//***Creating indexes for collections */
export async function createDbIndexes(indexes: CollectionIndex[], db) {
    for (let index of indexes) {
        await createIndex(db, index.collectionName, index.indexValue);
    }
}

//***Some typess */
export interface Validators {
    collectionName: string;
    validationModel: JSONSchema<string>;
}

export interface CollectionIndex {
    collectionName: string;
    indexValue: object;
}
