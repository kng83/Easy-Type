import { verify } from './verify.ctrl';

/** This class is used to wrap other class and make layer for error handling
 * It gives try-catch block for every async call in wrapped class
 */
export class ErrorLayer {
    constructor(instance) {
        this.initialize(instance);
    }
    //*** Wrapping controllers into Error function
    static wrapInstance<K, T extends new (arg) => K>(instance: K) {
        return new ErrorLayer(instance) as InstanceType<T>;
    }

    private initialize(instance) {
        this.propBinder(this.deepPrototypeKeySearch(instance), instance);
    }

    //*** Search recursive prototype for all keys
    private deepPrototypeKeySearch(instance: any) {

        function recursion(instance, allPropNames = []) {
            const proto = Object.getPrototypeOf(instance);
            const propNames = Object.getOwnPropertyNames(proto);
            allPropNames = [...allPropNames, ...propNames];

            if (Object.getPrototypeOf(proto).constructor === Object)
                return allPropNames;
            else
                return recursion(proto, allPropNames);
        }
        return recursion(instance);
    }

    //*** Obtain methods with before method which handles errors
    private propBinder(propNames, instance) {
        propNames.forEach((key: any) => {
            if (typeof instance[key] === "function" && key !== "constructor")
                this[key] = async (req, res) => {
                    try {
                        verify.checkForError(req);
                        await instance[key](req, res);
                    } catch (e) {
                        res.status(500).json(e.message);
                    }
                };
        });
    }
}








