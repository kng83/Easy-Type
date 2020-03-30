import { executeStandardQuery } from '../db';
import { Request, Response } from 'express';
import {tryCatchWrap} from './utilities';
import {log} from './utilities';
import {checkIfAllValuesExist} from './utilities';


class JobCtrl {

    //*** Get all elements in table */
    getAll = async (req: any, res: Response) => {

        let data = await executeStandardQuery(/*sql*/`     
            /*------------------------SQL---------------------------------*/
            select * from ticket t1 join ticket_notes t2 on  t1.tid=1 AND t1.tid = t2.tn_id;

            /*------------------------END_SQL-----------------------------*/
            `
        )
        return data;
    }

    //*** Get by name */
    getJobWithUsers = async (req: Request, res: Response) => {
      
        let data = await executeStandardQuery(/*sql*/`     
        
        /*------------------------SQL--------------------------------*/

        select u.first_name , u.last_name ,j.title , j.jid  from  "job" j join "user" u  on j.user_id = u.uid;
        /*------------------------END_SQL----------------------------*/
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


export const jobCtrl = tryCatchWrap(new JobCtrl());

