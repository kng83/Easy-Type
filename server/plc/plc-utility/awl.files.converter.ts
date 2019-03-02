import fs from 'fs';
import { UtilityTools} from '../../common/utility';
import { typeOfAll, typeOf1Byte, typeOf2Bytes, typeOf4Bytes, typeOf8Bytes } from './awl.types';
import { isArray } from 'util';


export function createAwlInterface(filePath: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) return reject(new Error('Something wrong with file in function createAwlInterface && ' + err.message));

            // let dataBlockName = searchForDataBlockName(data);
            // let dataBlockNumber = 1;
            // if (!dataBlockName) throw new Error('No datablock name');

            //do some processing..
            let makeInterface = UtilityTools.Chain.putData(data)
                .chain(data => getDataBetweenText(data, 'STRUCT', 'END_STRUCT'))
                .chain(data => replaceWord(data, /\b(struct)\b/gi, '{'))
                .chain(data => replaceWord(data, /\b(END_STRUCT)\b/gi, '}'))
                .chain(data => replaceWordFromArr(data, typeOfAll))
                .chain(data => replaceAllAwlArray(data, typeOfAll))
                .retrieve();

            resolve(makeInterface);
        });
    });

}

//*** This is combo function for creating object from awl file KNOW HOW PROTECT */
export function readSingleFile(filePath: string, targetStation: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {

            if (err) return reject(new Error('Something wrong with file in function readSingleFile && ' + err.message));

            let dataBlockNumber = retrieveDbNumberFromFileName(filePath);
            if (dataBlockNumber == -1) return reject('No datablock number in file name');

            let dataArr = UtilityTools.Chain.putData(data)
                .chain(data => getDataBetweenText(data, 'STRUCT', 'END_STRUCT'))
                .chain(data => replaceWordFromArr(data, typeOfAll))
                .chain(data => putTextLinesIntoArray(data, '\r\n'))
                .chain(rowsArr => slimDataAgainstPattern(rowsArr, /(\r\n|\n|\r)/gm))
                .chain(rowsArr => slimDataAgainstPattern(rowsArr, /[/]/g))
                .chain(rowsArr => slimDataAgainstPattern(rowsArr, /\s[:]\s/g, ';'))
                .chain(rowsArr => putStringsIntoArray(rowsArr))
                .chain(itemArr => removeEmptyArrElements(itemArr))

                .chain(itemArr => makeComputedStructures(itemArr))
                .chain(itemArr => createObjectFromAwlTable(itemArr, dataBlockNumber, targetStation))
                .retrieve();

            resolve(dataArr);
        });

    });
}//

//***Create obj from awl table
function createObjectFromAwlTable(data: any[], dataBlockNumber: number, targetStation: string) {
    console.log('------------------------------------------------------------');
    let obj = {};
    let previousElement = { db: dataBlockNumber, dbb: 0, bit: 0, sD: 0, type: null };
    data.forEach(element => {
        previousElement = createObjFromArrayRows(element, obj, previousElement, targetStation);
    });
    return obj;
}

//***Create object from array rows and removes duplicates */
function createObjFromArrayRows(element, target: object, previousElement: any, targetStation: string) {

    // looking for nested struct
    let payload = creatingPayloadObj(element, previousElement, targetStation);
    structuredObjectAssign(target, makeObjFromArrElement(element, payload));
    return payload;
}

//
//*** Counting payload
function creatingPayloadObj(currentElement, previousElement, targetStation: string) {
    let lastStructIndex = currentElement.lastIndexOf('COMPUTED_STRUCT');
    let typeResolver = resolveAwlType(currentElement[lastStructIndex + 2], typeOfAll);
    let arrayDepth = typeResolver.isArr ? 1 : 0;
    let structDepth = countingSearches(currentElement, 'COMPUTED_STRUCT') + arrayDepth;

    let currentPayload = {
        type: typeResolver.type,
        description: currentElement[lastStructIndex + 3],
        sD: structDepth
    };
    // For counting array offset
    if (isArray(previousElement)) {
        previousElement = previousElement[previousElement.length - 1];
    }

    if (typeResolver.isArr === true) {
        return countingArrayOffsets(currentPayload, previousElement, typeResolver.repetition, targetStation);

    } else {
        return countingOffsets(currentPayload, previousElement, targetStation);
    }
}//

//*** Retrieve type and array length from awl array type; Example Array[0..10] of Bool
function resolveAwlType(cell: string, typesArr) {

    let repetition = 0;
    let isArr = false;

    if (cell.search(/Array/i) !== -1) {
        isArr = true;
        let beginBracket = cell.indexOf('[');
        let beginDot = cell.indexOf('.');

        let endDot = cell.lastIndexOf('.');
        let endBracket = cell.indexOf(']');

        let startNumber = cell.slice(beginBracket + 1, beginDot);
        let endNumber = cell.slice(endDot + 1, endBracket);

        repetition = Number(endNumber) - Number(startNumber) + 1;
    }

    return { type: findStringFromArrPattern(cell, typesArr), repetition, isArr };
}



//*** Counting offset for array type
function countingArrayOffsets(currentPayload, previousPayload: any, repetition: number, targetStation: string) {
    let payloadArr = [];

    function repeat(currentPayload, previousPayload, repetition) {
        let computedPayload = countingOffsets(currentPayload, previousPayload, targetStation);
        payloadArr.push(computedPayload);
        repetition = repetition - 1;

        if (repetition <= 0) {
            return payloadArr;
        } else {
            return repeat(currentPayload, computedPayload, repetition);
        }
    }

    return repeat(currentPayload, previousPayload, repetition);
}

//***Count new offset
function countingOffsets(currentElement, previousElement: any, targetStation: string) {
    //last type from past
    let pBit = previousElement.bit;
    let pDb = previousElement.db;
    let pDbb = previousElement.dbb;
    let pStructDepth = previousElement.sD;
    let pType = previousElement.type;
    let offset = 0;
    let bitTotalOffset = 0;

    //new type
    let tType = currentElement.type;
    let tDesc = currentElement.description;
    let tStructDepth = currentElement.sD;

    if (pDbb % 2 === 0) {
        offset =
            typeOf8Bytes.find(value => value === pType) ? 8
                : typeOf2Bytes.find(value => value === pType) ? 2
                    : typeOf4Bytes.find(value => value === pType) ? 4
                        : typeOf1Byte.find(value => value === pType) ? 1
                            : typeOf1Byte.find(value => value === tType && pType == 'BOOL' && tStructDepth == pStructDepth) ? 1
                                : ['BOOL'].find(value => value === pType && value !== tType) ? 2
                                    : ['BOOL'].find(value => value === pType && tStructDepth !== pStructDepth) ? 2
                                        : ['BOOL'].find(value => value === pType && value == tType && pBit == 7) ? 1
                                            : 0;


        bitTotalOffset = [typeOf8Bytes, ...typeOf4Bytes, ...typeOf2Bytes, ...typeOf1Byte]
            .find(value => value === tType) ? 0

            : ['BOOL'].find(value => value === pType && value === tType && pBit < 7 && tStructDepth == pStructDepth) ? (pBit + 1)
                : ['BOOL'].find(value => value === pType && value == tType && pBit == 7) ? 0
                    : 0;

    }

    //For previous value Bool,Byte ,Char
    if (pDbb % 2 !== 0) {
        offset =
            [...typeOf8Bytes, ...typeOf4Bytes, ...typeOf2Bytes, ...typeOf1Byte]
                .find(value => value == tType) ? 1
                : typeOf1Byte.find(value => value === pType) ? 1
                    : ['BOOL'].find(value => value === pType && value === tType && pBit == 7) ? 1
                        : ['BOOL'].find(value => value === tType && tStructDepth != pStructDepth) ? 1
                            : 0;


        bitTotalOffset = [typeOf8Bytes, ...typeOf4Bytes, ...typeOf2Bytes, ...typeOf1Byte]
            .find(value => value === tType) ? 0
            : ['BOOL'].find(value => value === pType && value === tType && pBit < 7) ? (pBit + 1)
                : ['BOOL'].find(value => value === pType && value == tType && pBit == 7) ? 0
                    : 0;
    }

    // Everything together now
    return {
        type: tType,
        db: pDb,
        dbb: pDbb + offset,
        bit: bitTotalOffset,
        desc: tDesc,
        sD: tStructDepth,
        value: undefined,
        rOk: undefined,
        wOk: undefined
    };
}


//***Assign main obj with single object created from array */
function structuredObjectAssign(target, objFromArrElement) {

    let targetKeys = Object.keys(target);
    let checkKey = Object.keys(objFromArrElement)[0];
    let ans = targetKeys.find((value) => value === checkKey);

    //Checking for duplicates or end of object depth
    if (ans && objFromArrElement[checkKey] !== undefined) {
        return structuredObjectAssign(target[checkKey], objFromArrElement[checkKey]);
    } else {
        target[checkKey] = objFromArrElement[checkKey];
        return 0;
    }

}

//***Make nested object from flatten array which is an element */
function makeObjFromArrElement(element, payload) {
    let el = element.slice();
    let lastStructIndex = el.lastIndexOf('COMPUTED_STRUCT');
    let o = { [el[lastStructIndex + 1]]: payload };
    if (lastStructIndex >= 1) {
        el.splice(lastStructIndex, el.length - lastStructIndex);
        return makeObjFromArrElement(el, o);
    } else {
        return o;
    }
}

//*** Jump trough big array of rows and change structure to computed structure
function makeComputedStructures(data: any[]) {
    let position = findStructurePosition(data);
    let ret = createStructuresRows(data, position.structStart, position.structEnd);

    if (ret.some(elements => checkIfArrayHaveWord(elements, /\b(struct)\b/))) {
        return makeComputedStructures(ret);
    }
    return ret;
}

//*** Find position of a struct and end_struct;
function findStructurePosition(data: any[]) {
    let oldBalance: any;
    let structBalance = null;
    let structStart = 0;
    let structEnd = 0;

    let find = data.some((elements: string[], mainIndex) => {

        if (checkIfArrayHaveWord(elements, /\b(struct)\b/)) {
            structBalance++;
        }
        if (checkIfArrayHaveWord(elements, /\b(end_struct)\b/)) {
            structBalance--;
        }
        if (structBalance === 1 && structBalance != oldBalance) {
            structStart = mainIndex;
        }
        if (structBalance > 1 && structBalance != oldBalance) {
            structStart = mainIndex;
            structBalance--;
        }

        if (structBalance === 0) {
            structEnd = mainIndex;
        }
        oldBalance = structBalance;

        if (structBalance === 0 && structEnd !== null && structStart !== null) {
            return true;
        }
    });
    return { structStart, structEnd };
    // if (find) return { structStart, structEnd }

}

//*** Change each row of struct into Computed_struct rows
function createStructuresRows(data, startIndex: number, endIndex: number) {
    let d = data.slice();
    const structName = data[startIndex][0];

    for (let i = startIndex + 1; i < endIndex; i++) {
        d[i].unshift(structName, 'COMPUTED_STRUCT');
    }
    d.splice(startIndex, 1);
    d.splice(endIndex - 1, 1);
    return d;
}

//*** Check if given string occurs in the array cell */
function checkIfArrayHaveWord(data: string[], pattern: string | RegExp) {
    return data.some(item => item.toLocaleLowerCase().search(pattern) == 0);
}

//*** Remove empty arrays
function removeEmptyArrElements(data: any[]) {
    return data.filter((value) => value.length > 1);
}

//*** Separate single string row with ";" and make trim() on each separate string
function putStringsIntoArray(s: string[]) {
    return s.map(value => {
        let singleRowArr = putTextLinesIntoArray(value, ';');
        return singleRowArr.map((val: string) => val.trim());
    });
}

//*** Clear data which is array of strings from some patterns ,dust
function slimDataAgainstPattern(data: string[], pattern, replacer = "") {
    return data.map((element) => {
        return element.replace(pattern, replacer);
    });
}

//*** Separate data to array using cut by separator
function putTextLinesIntoArray(data: string | number, separator: string): string[] {
    if (typeof data == "number") {
        throw new Error('data cannot be number');
    }
    let arr = [];

    //sepLength is used to remove separators from output
    return function fetchData(firstPlace = 0, index = 0, sepLength = 0) {
        let rowNumber = advancedSearch(data, separator, index);
        let dataRow: string;

        if (rowNumber !== -1) {
            dataRow = data.slice(firstPlace + sepLength, rowNumber);
            arr.push(dataRow);
            return fetchData(rowNumber, ++index, separator.length);
        } else {
            dataRow = data.slice(firstPlace + sepLength, data.length);
            arr.push(dataRow);
            return arr;
        }
    }();
}

//*** Take data string between named strings
function getDataBetweenText(data: string, beginString: string, endString: string): string | number {
    let begin = data.indexOf(beginString) + beginString.length;
    let end = data.lastIndexOf(endString);
    if (begin == -1 + beginString.length || end == -1) {
        return -1;
    }
    return data.slice(begin, end);
}

//*** Searching for datablock name
function searchForDataBlockName(data) {
    let firstComment = data.search("\"");
    let secondComment = advancedSearch(data, "\"", 1);
    return data.slice(firstComment + 1, secondComment);
}

//---------------------------------------------------------------------------------------------------------------------
//*** For Creating interface files
//*** Replace enum of types in string-data.Type is enum type but array ok;
function replaceWordFromArr(data: string, enumArr: any) {
    let d = data.slice();
    enumArr.forEach(value => {
        let pattern = `\\b(${value})\\b`;
        let regExp = new RegExp(pattern, 'gi');
        d = replaceWord(d, regExp, value);
    });
    return d;
}



//*** Replace all awl arrays with interface arr
function replaceAllAwlArray(data: string, typesArr: string[]) {
    let d = data.slice();
    typesArr.forEach((value) => {
        d = replaceAwlArray(d, value);
    });
    return d;
}

//*** Replace siemens type array with interface arr;
function replaceAwlArray(data: string, type: string) {
    //For Bool it look like /\b(Array\[0..+?]\ of Bool)\b/g
    let pattern = `\\b(Array\\s*\\s*\\[+?..+?]\\s*\\s*of\\s*${type})\\b`;
    let computedPattern = new RegExp(pattern, 'gi');
    return data.replace(computedPattern, `${type}[]`);
}

//---------------------------------------------------------------------------------------------------------------------
//*** Utility
//*** Search for n sign
function advancedSearch(data: string, pattern: string, placeNumber: number) {
    return function con(pos = 0, i = 0) {
        const position = data.indexOf(pattern, pos);
        if (i >= placeNumber) return position;
        return con(position + 1, ++i);
    }();
}

//***Counting number of pattern values in data array */
function countingSearches<T>(data: T[], pattern: T) {
    return data.filter(function (value) {
        return value === pattern;
    }).length;

}

//*** Find type which exists in  pattern Array in string element
function findStringFromArrPattern(el: string, typesArr: string[]) {
    return typesArr.find(value => el.toUpperCase().includes(value.toUpperCase()) === true);
}

//*** Replace word with other word in string data
function replaceWord(data: string, oldValue: string | RegExp, newValue: string) {
    return data.replace(oldValue, newValue);
}


//***Retrieve number of datablock in file name */
function retrieveDbNumberFromFileName(filePath: string) {
    let dbPos = filePath.search(/db[0-9]+/gi);
    if (dbPos == -1) return dbPos;

    for (let i = dbPos + 2; i < filePath.length; i++) {
        if (isNaN(Number(filePath[i]))) {
            return Number(filePath.slice(dbPos + 2, i));
        }
    }
}
