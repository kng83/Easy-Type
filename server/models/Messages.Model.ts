import { JSONSchema } from '../base/model-preparation/model_creator/JSON.Schema';


export const messagesValidationModel: JSONSchema<string> = {
    bsonType: "object",
    required: ["tit", "content", "userType"],
    additionalProperties: false,
    properties: {
        userType: {
            bsonType: "string",
            description: "must be a string and is required"
        },
        content: {
            bsonType: "string",
            description: "must be a string and is required"
        },
        tit: {
            bsonType: "string",
            description: "must be an integer in [ 2017, 3017 ] and is required"
        },
        _id: {
            bsonType: 'objectId',
            description: "created automatically in database"
        }
    }
};






