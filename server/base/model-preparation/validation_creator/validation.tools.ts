import {Collection, Db} from "mongodb";
import {log} from "../../../config/app.config";

//***Apply validator to specific collection */
export async function validateCollection(database: Db, collName: string, validationSchema) {
  try {
    let collectionExists = await checkIfCollectionExists(database, collName);
    let validationStatus;
    let createCollectionStatus;

    if (collectionExists) {
      validationStatus = await database.command({
        collMod: collName,
        validator: {$jsonSchema: validationSchema},
        validationLevel: "moderate",
        validationAction: "error"
      });
    } else {
      createCollectionStatus = await database.createCollection(collName, {
        capped: false,
        validator: {$jsonSchema: validationSchema},
        validationLevel: "moderate",
        validationAction: "error",
      });
    }

    if ((validationStatus || createCollectionStatus)) {

      let validatorApplied = validationStatus.ok == 1;
      let collCreated = createCollectionStatus != null;
      return {collCreated: collCreated, validatorApplied: validatorApplied};
    }

  } catch (e) {
    log.error(e.message);
  }

}

//***Create index */
export async function createIndex(database: Db, collName: string, collectionIndex?: any) {
  try {
    let collectionExists = await checkIfCollectionExists(database, collName);
    if (!collectionExists) throw new Error("Collection do not exist!!!");
    if (collectionIndex === null || collectionIndex === undefined) return {index: null};

    let collection: Collection<any> = await database.collection(collName);
    let {field, options} = collectionIndex;
    let indexFinished = await collection.createIndex(field, options);
    return {index: indexFinished};

  } catch (e) {
    console.log(e.message, "function createIndex");
  }
}

function checkIfCollectionExists(database: Db, collName): Promise<boolean> {
  return database
    .listCollections()
    .toArray()
    .then(collections => collections.reduce((p, acc) => [...p, acc.name], []))
    .then(collection => collection.some((coll) => coll === collName));
}
