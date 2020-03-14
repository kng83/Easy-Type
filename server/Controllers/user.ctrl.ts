import { executeStandardQuery } from '../db';
import { Request, Response } from 'express';
import {tryCatchWrap} from '../Controllers/utilities'


class UserCtrl {

    //*** Get all elements in table */
    getAll = async (req: any, res: Response) => {
        let some = req.self.ohter.down()

        let data = await executeStandardQuery(/*sql*/`     
                /*------------------------SQL-----------------------------*/

                Select * from users;

                /*------------------------END_SQL------------------------*/
                `
        )
        return res.send(data)
    }

    //*** Get by name */
    getByName = async (req: Request, res: Response) => {
        let result = await req.query;
        let firstName = '';

        if (result?.name) {
            firstName = result.name;
        }

        let data = await executeStandardQuery(/*sql*/`     
        
        /*------------------------SQL-----------------------------*/

        select * from users where firstName='${firstName}';

        /*------------------------END_SQL------------------------*/
        `
        )

        return res.send(data);
    }

    insertUser = async (req: Request, res: Response) => {
        let data = {};

            let result = await req.query;
            const { firstName, lastName, age } = result;
            checkIfAllValuesExist('not all values exists', firstName, lastName, age);
            console.log('insertUserr');
            data = await executeStandardQuery(/*sql*/`     
            
            /*------------------------SQL-----------------------------*/
    
            INSERT INTO users (firstName1,lastName,age)
            Values ('${firstName}','${lastName}','${age}')
    
            /*------------------------END_SQL------------------------*/
            `
            )
        return data;

    }


}


export const userCtrl = tryCatchWrap(new UserCtrl());

function checkIfAllValuesExist<T extends any[]>(msg: string, ...values: T) {
    if (values.some(value => value === null || value === undefined)) {
        throw new Error(msg);
    }
}
