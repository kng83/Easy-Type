import {JsonUniqueKeyArr} from './JSON.Schema';
import {caseEnumType, caseCombineDataType} from './JSON.Schema';


/*** Function is responsible for making array from mongo json validation object.This nested
 array have fields [propName,type|object|array,type]
 */
function again(obj, counter, arrP: any[], checked: boolean, required: string[], addProp = true) {

    if (!areKeysUnique(obj, JsonUniqueKeyArr) || checked) {
        if (obj['items']) {
            return again(obj['items'], 0, arrP, false, obj['required'], obj['additionalProperties']);

        }

        again(obj['properties'], 0, arrP, false, obj['required'], obj['additionalProperties']);
    } else {
        let uniqueKey = findNextUniqueKey(obj, JsonUniqueKeyArr, counter);
        let bsonObjType = obj[uniqueKey]['bsonType'];

        if (bsonObjType !== 'object' && bsonObjType !== undefined && bsonObjType !== 'array') {
            if (checkIfKeyExist(uniqueKey, required)) {
                arrP.push([uniqueKey, ':', 'type', bsonObjType])
            }
            //check if are additional props
            if (addProp == true && !checkIfKeyExist(uniqueKey, required)) {
                arrP.push([uniqueKey, '?:', 'type', bsonObjType]);
            }
        }

        if (bsonObjType == undefined && obj[uniqueKey]['enum']) {
            if (checkIfKeyExist(uniqueKey, required)) {
                arrP.push([uniqueKey, ':', 'enum', obj[uniqueKey]['enum']])
            }
            if (addProp == true && !checkIfKeyExist(uniqueKey, required)) {
                arrP.push([uniqueKey, ':', 'enum', obj[uniqueKey]['enum']])
            }
        }

        if (bsonObjType == 'array') {
            arrP.push([uniqueKey, ':', 'array', []]);
            let length = arrP.length - 1;
            again(obj[uniqueKey], 0, arrP[length][3], false, required, addProp)
        }

        if (bsonObjType == 'object') {
            arrP.push([uniqueKey, ':', 'object', []]);
            let length = arrP.length - 1;
            again(obj[uniqueKey], 0, arrP[length][3], false, required, addProp)
        }

        ++counter;
        if (countUniqueKeys(obj, JsonUniqueKeyArr) > counter)
            again(obj, counter, arrP, false, required, addProp);

        if (obj['properties'] !== undefined || obj['items'] !== undefined)
            again(obj, 0, arrP, true, [], addProp);
    }
    return arrP;
}


//*** Find next unique key which isn't present in keyArr
function findNextUniqueKey(obj: object, keyArr, startCounter = 0): string | undefined {
    let odp = Object.keys(obj).filter(key => {
        if (!keyArr.includes(key)) {
            return key;
        }
    });
    return odp[startCounter];
}

//*** Check if property exist
function checkIfKeyExist(key: string, arr: string[]) {
    try {
        return arr.includes(key)

    } catch (e) {
        return false;
    }
}

//*** Check if there are some keys which aren't present in keyArr
function areKeysUnique(obj: object, keyArr) {
    return countUniqueKeys(obj, keyArr) > 0;
}

//*** Counting keys which are not represented in keyArr
function countUniqueKeys(obj: object, keyArr) {
    return Object.keys(obj).filter(key => {
        if (!keyArr.includes(key)) {
            return key;
        }
    }).length;
}

//*** Create array of given properties from json validation format */
export function jsonTreeRunner(jsonObj) {
    return again(jsonObj, 0, [], false, [], false);
}

//*** Create payload for class model creator
export function createMongoStringObj(objArr, payload = '', separator = '') {
    let p = payload;
    objArr.forEach(element => {
        if (element[2] === 'type')
            p = `${p} \n ${separator} ${element[0]} ${element[1]} ${caseCombineDataType(element[3])};`;

        if (element[2] === 'enum')
            p = `${p} \n ${separator} ${element[0]} ${element[1]} ${caseEnumType(element[3])};`;

        if (element[2] === 'object') {
            p = `${p} \n ${separator} ${element[0]} ${element[1]} { ${createMongoStringObj(element[3], '', separator + '\t\t')}\n ${separator}}`;
            return p;
        }
        if (element[2] === 'array') {
            p = `${p} \n ${separator} ${element[0]} ${element[1]} { ${createMongoStringObj(element[3], '', separator + '\t\t')}\n ${separator}}[]`;
            return p;
        }
    });
    return p;
}