import { Db } from "mongodb";

export abstract class SingletonLayer {

    private _instance?: SingletonLayer;
    public static makeInstance<T extends SingletonLayer>(this: new (db) => T, db: Db) {
        const self: T = this as any; // hack
        return (self._instance || (self._instance = new this(db))) as T;
    }

}
