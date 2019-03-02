import { isObject, isArray } from "util";

/*** This function is used to print object.
 *  It's designed for awl files. Might work with some others payloads
 */
export function printObject(obj: Object) {
    let payload = '';
    let bS = ''; // branch start
    let bE = ''; // branch end
    let p = ''; // paragraph
    let c = ':'; // colon
    let t = ''; // tabulator
    let lb = '\r\n'; // line brake and caret return
    let com = ','; // comma

    return function again(obj, totalS) {
        const keyArr = Object.keys(obj);
        const keyArrLength = keyArr.length;

        keyArr.forEach((key, index) => {

            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                payload = again(obj[key], '');
            } else if (isArray(obj[key])) {
                payload = again(obj[key], '');
            } else {
                payload = obj[key];
            }
            if (typeof obj[key] === 'string') {
                bS = '';
                bE = '';
                p = "\'";
                t = '';
                c = ':';
                lb = '';
                com = ',';
            }
            if (typeof obj[key] === 'number') {
                bS = '';
                bE = '';
                p = '';
                t = '';
                c = ':';
                lb = '';
                com = ',';
            }
            //remove colon at the end of block 
            if ((typeof obj[key] === 'number' || typeof obj[key] === 'string' || typeof obj[key] === 'undefined')
                && index == keyArrLength - 1) {
                com = '';
            }
            if (Array.isArray(obj[key])) {
                bS = '[\n';
                bE = ' ]';
                p = "";
                t = '';
                c = ':';
                lb = '\r\n';
                com = ',';
            }

            if (isObject(obj[key]) && !Array.isArray(obj[key])) {
                bS = '{';
                bE = '}';
                p = "";
                t = '\t';
                c = ':';
                lb = '\r\n';
                com = ',';
            }
            if (isObject(obj[key]) && index == keyArrLength - 1) {
                com = '';
            }
            //***This is for omitting arrays keys which are number
            if (!isNaN(<any>key)) {
                c = '';
                key = '';
                t = '';
                lb = '\r\n';
                p = '';
            }
            totalS = totalS
                .concat(`${t}${key}${c} ${bS}${p}${payload}${p}${bE}${com}${lb}`);
        });
        return totalS;
    }(obj, '');
}
