import { executeStandardQuery } from '../db';
import { Request, Response } from 'express';
import {tryCatchWrap} from '../Controllers/utilities';
import {log} from '../Controllers/utilities';


class UserCtrl {

    //*** Get all elements in table */
    getAll = async (req: any, res: Response) => {

        let data = await executeStandardQuery(/*sql*/`     
                /*------------------------SQL-----------------------------*/
              select * from "user"

                /*------------------------END_SQL------------------------*/
                `
        )
        return data;
    }

    //*** Get by name */
    getByName = async (req: Request, res: Response) => {
        let result = await req.query;
        let first_name = '';

        if (result?.name) {
            first_name = result.name;
        }

        let a = first_name.match(/[a-z]|[A-Z]|ą|ó|ę|ś|ć|ń|Ś|ż|ź|Ż|Ź|Ó/g);
        let data = await executeStandardQuery(/*sql*/`     
        
        /*------------------------SQL-----------------------------*/

        select * from "user" where first_name='${first_name}';
        /*------------------------END_SQL------------------------*/
        `
        )
        return data;
    }

    insertUser = async (req: Request, res: Response) => {
        let data = {};

            let result = await req.query;
            const { first_name, last_name} = result;
            checkIfAllValuesExist('not all values exists', first_name, last_name);

            data = await executeStandardQuery(/*sql*/`     
            
            /*------------------------SQL-----------------------------*/
    
            INSERT INTO "user"(first_name,last_name)
            Values ('${first_name}','${last_name}')
    
            /*------------------------END_SQL------------------------*/
            `
            )
        log(data);
        return data;

    }


}


export const userCtrl = tryCatchWrap(new UserCtrl());

function checkIfAllValuesExist<T extends any[]>(msg: string, ...values: T) {
    if (values.some(value => value === null || value === undefined)) {
        throw new Error(msg);
    }
}
