import {Collection, Db} from "mongodb";
import {SingletonLayer} from "./singleto.layer";


export abstract class DataBaseService extends SingletonLayer {

    public col: Collection;
    protected abstract get collectionName(): Promise<string>;

    protected constructor(database: Db) {
        super();
        this.init(database).catch(e => console.log(e));
    }

    private init = async (db: Db) => {
        try {
            const collName = await this.collectionName;
            console.log(collName);
            this.col = db.collection(collName);
        } catch (e) {
            console.log(e.message);
        }
    }
}


