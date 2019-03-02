import { JSONSchema } from '../base/model-preparation/model_creator/JSON.Schema';
//import { propsExtractor } from "../common/extract";

export class UserRole {
    public wozkowy = 'wozkowy';
    public maszynista = 'maszynista';
    public admin = 'admin';
}

export const userValidationModel: JSONSchema<string> = {
    bsonType: "object",
    required: ["firstName", "lastName", "email", "password", "role", "cardNumber"],
    additionalProperties: false,
    properties: {
        firstName: {
            bsonType: "string",
            description: "must be a string and is required"
        },
        lastName: {
            bsonType: "string",
            description: "must be a string and is required"
        },
        _id: {
            bsonType: 'objectId',
            description: "created automatically in database"
        },
        email: {
            bsonType: "string",
            pattern:   "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$",
            description: "must be an integer in [ 2017, 3017 ] and is required"
        },
        password: {
            bsonType: "string",
            description: "must be a string and is required"
        },
        role: {
            enum: Object.values(new UserRole()),
            // enum: ['maszynista', 'admin', 'wozkowy'],
            description: "can only be one of the enum values and is required"
        },
        cardNumber: {
            bsonType: ["int", "long"],
            description: "must be a number and is required"
        }
    }
};

//*** Create index */
export const UserIndex = { field: { email: 1 }, options: { unique: true } };




