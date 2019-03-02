
// Key Names is list of keys that is used in json schema


export interface JSONSchema<KeyNames extends string> {
    bsonType?: BsonType | BsonType[];  // Accepts same string aliases used for the $type operator
    enum?: any[]; // Enumerates all possible values of the field
    type?: TypeField | TypeField[]; // Enumerates the possible JSON typess of the field. Available typess are “object”, “array”, “number”, “boolean”, “string”, and “null”.
    allOf?: JSONSchema<KeyNames>[]; // Field must match all specified schemas
    anyOf?: JSONSchema<KeyNames>[]; // Field must match at least one of the specified schemas
    oneOf?: JSONSchema<KeyNames>[]; // Field must match exactly one of the specified schemas
    not?: JSONSchema<KeyNames>; // Field must not match the schema
    multipleOf?: number; // Field must be a multiple of this value
    maximum?: number; // Indicates the maximum value of the field
    exclusiveMaximum?: boolean; // 	If true and field is a number, maximum is an exclusive maximum. Otherwise, it is an inclusive maximum.
    minimum?: number; // Indicates the minimum value of the field
    exclusiveMinimum?: boolean; // If true, minimum is an exclusive minimum. Otherwise, it is an inclusive minimum.
    maxLength?: number; // Indicates the maximum length of the field
    minLength?: number; // Indicates the minimum length of the field
    pattern?: RegExp | string; // Field must match the regular expression
    maxProperties?: number; // Indicates the field’s maximum number of properties
    minProperties?: number; // Indicates the field’s minimum number of properties
    required?: Array<KeyNames> // Object’s property set must contain all the specified elements in the array
    additionalProperties?: boolean | JSONSchema<KeyNames>; // If true, additional fields are allowed. If false, they are not. If a valid JSON Schema object is specified, additional fields must validate against the schema.Defaults to true.
    properties?: SchemaProperties<KeyNames>; // A valid JSON Schema where each value is also a valid JSON Schema object
    patternProperties?: object; //In addition to properties requirements, each property name of this object must be a valid regular expression
    dependencies?: object; // Describes field or schema dependencies
    additionalItems?: boolean | JSONSchema<KeyNames>; // 	If an object, must be a valid JSON Schema
    items?: JSONSchema<KeyNames> | JSONSchema<KeyNames>[]; // Must be either a valid JSON Schema, or an array of valid JSON Schemas
    maxItems?: number; // Indicates the maximum length of array
    minItems?: number; // Indicates the minimum length of array
    uniqueItems?: boolean; // If true, each item in the array must be unique. Otherwise, no uniqueness constraint is enforced.
    title?: string; // A descriptive title string with no effect.
    description?: string; // A string that describes the schema and has no effect.
}


type TypeField = "object" | "array" | "number" | "boolean" | "string" | "null"
type BsonType =
    | "double" | "string" | "object"
    | "array" | "binData" | "objectId"
    | "bool" | "data" | "data"
    | "null" | "regex" | "javascript"
    | "int" | "timestamp" | "long"
    | "decimal" | "minKey" | "maxKey"
    | "dbPointer" | "symbol" | "decimal"
    | "javascriptWithScope" | string;

type SchemaProperties<T extends string> = { [K in T]?: JSONSchema<T> }


export let JsonUniqueKeyArr: Array<keyof JSONSchema<string>> = [
    "bsonType",
    "enum",
    "type",
    "allOf",
    "anyOf",
    "oneOf",
    "not",
    "multipleOf",
    "maximum",
    "exclusiveMaximum",
    "minimum",
    "exclusiveMinimum",
    "maxLength",
    "minLength",
    "pattern",
    "maxProperties",
    "minProperties",
    "required",
    "additionalProperties",
    "properties",
    "patternProperties",
    "dependencies",
    "additionalItems",
    "items",
    "maxItems",
    "minItems",
    "uniqueItems",
    "title",
    "description"
];

enum BsonDataType {
    double = 'double',
    string = 'string',
    object = 'object',
    array = 'array',
    binData = 'binData',
    objectId = 'objectId',
    bool = 'bool',
    data = 'data',
    null = 'null',
    regex = 'regex',
    javascript = 'javascript',
    int = 'int',
    timestamp = 'timestamp',
    long = 'long',
    decimal = 'decimal',
    minKey = 'minKey',
    maxKey = 'maxKey',
    dbPointer = 'dbPointer',
    symbol = 'symbol',
    javascriptWithScope = 'javascriptWithScope'
}

//*** Resolve mongodb type for node typess */
export function caseDataType(dataType: keyof typeof BsonDataType) {
    let value: any;
    switch (dataType) {
        case BsonDataType.double:
            value = 'number';
            break;
        case BsonDataType.string:
            value = 'string';
            break;
        case BsonDataType.object:
            value = 'any';
            break;
        case BsonDataType.array:
            value = 'any[]';
            break;
        case BsonDataType.binData:
            value = 'number';
            break;
        case BsonDataType.objectId:
            value = 'string';
            break;
        case BsonDataType.bool:
            value = 'boolean';
            break;
        case BsonDataType.data:
            value = 'object';
            break;
        case BsonDataType.null:
            value = 'null';
            break;
        case BsonDataType.regex:
            value = 'string';
            break;
        case BsonDataType.javascript:
            value = 'any';
            break;
        case BsonDataType.int:
            value = 'number';
            break;
        case BsonDataType.timestamp:
            value = 'number';
            break;
        case BsonDataType.long:
            value = 'number';
            break;
        case BsonDataType.decimal:
            value = 'number';
            break;
        case BsonDataType.minKey:
            value = 'number';
            break;
        case BsonDataType.maxKey:
            value = 'number';
            break;
        case BsonDataType.dbPointer:
            value = 'any';
            break;
        case BsonDataType.symbol:
            value = 'any'
            break;
        case BsonDataType.javascriptWithScope:
            value = 'any';
            break;
        default: null;
    }
    return value;
}

//***Make one type when is multiply type array egz.:[long,int,string] = number | string */
export function caseCombineDataType(dataType) {
    let ans = '';
    if (dataType instanceof Array) {
        dataType.forEach((el, index) => {
            let separator = (dataType.length - 1 > index) ? ' | ' : '';
            ans = ans + caseDataType(el) + separator;
        });
        return ans;
    } else {
        return caseDataType(dataType);
    }
}

//*** Resolve enum type */
export function caseEnumType(itemsArr) {
    let outString: any;
    itemsArr.forEach(item => {
        let separator = '';
        if (typeof item == 'number') {
            separator = '';
        }
        if (typeof item == 'string') {
            separator = "'";
        }

        if (outString) {
            outString = outString + ' | ' + separator + item + separator;
        } else {
            outString = separator + item + separator;
        }
    });
    return outString;
}



