// import { executeStandardQuery } from '../db';
// import { Request, Response } from 'express';


// export namespace ctrl {

//     //*** Get all elements in table */
//     export const getAll = async (req: Request, res: Response) => {

//         let data = await executeStandardQuery(/*sql*/`     
//                 /*------------------------SQL-----------------------------*/

//                 Select * from users;

//                 /*------------------------END_SQL------------------------*/
//                 `
//         )
//         return res.send(data)
//     }


//     export const getByName = async (req: Request, res: Response) => {
//         let result = await req.query;
//         let firstName = '';
//         console.log(result);
//         if (result?.name) {
//             firstName = result.name;
//         }

//         let data = await executeStandardQuery(/*sql*/`     
        
//         /*------------------------SQL-----------------------------*/

//         select * from users where firstName='${firstName}';

//         /*------------------------END_SQL------------------------*/
//         `
//         )

//         return res.send(data);
//     }

//     export const insertUser = async (req: Request, res: Response) => {
//         let data = {};
//         try {
//             let result = await req.query;
//             const { firstName, lastName, age } = result;
//             checkIfAllValuesExist('not all values exists' ,firstName, lastName, age);

//             data = await executeStandardQuery(/*sql*/`     
            
//             /*------------------------SQL-----------------------------*/
    
//             INSERT INTO users (firstName,lastName,age)
//             Values ('${firstName}','${lastName}','${age}')
    
//             /*------------------------END_SQL------------------------*/
//             `
//             )
//         } catch (e) {
//             data = e.message;
//         }

//         return res.send(data);

//     }


// }


// function checkIfAllValuesExist<T extends any[]>(msg:string,...values: T) {
//     if (values.some(value => value === null || value === undefined)) {
//         throw new Error(msg);
//     }
// }
