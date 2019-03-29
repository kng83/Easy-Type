import { pyszczekQuery } from '../db';
import { sql } from '../Tagged_Templates/sql_literals';


export namespace ctrl {

    //*** Get all elements in table */
    export const getAll = async (req, res) => {
        let num = `2`
        let data = await pyszczekQuery(
            sql`     
                ------------------------SQL-----------------------------

                SELECT TOP ${num} *
                    FROM [Pyszczek].[dbo].[Pets]
                    ORDER BY id desc;

                 ------------------------END_SQL------------------------
                `
        )
        console.log(data);
        return res.send(data)
    }

    export const getOldest = async (req, res) => {
        let data = await pyszczekQuery(
            sql`
                ------------------------SQL----------------------------

                SELECT TOP 1 [name] FROM [Pyszczek].[dbo].[Pets]
                ORDER by id desc;

                ------------------------END_SQL------------------------
                `
        )
        console.log(data);
        return res.send(data);
    }

    //*** Get by id */
    export const getById = async (req, res) => {
        let {id} = req.params;
        console.log(req.params);
        console.log(req.query);
        let data = await pyszczekQuery(
            sql`
                ------------------------SQL----------------------------

                SELECT TOP 1 [name] FROM [Pyszczek].[dbo].[Pets]
                Where id = ${id};

                ------------------------END_SQL------------------------
                `
        )
        console.log(data);
        return res.send(data);
    }

    /***User req.params to insert som data to table Pets 
    { id: 3, Like: 'Playing', pet: 'Piotrek', name: 'Zuzia' }
    */
    export const insertNewPet = async (req,res) =>{

        let dbData = await pyszczekQuery(
            sql`
                ------------------------SQL----------------------------

                SELECT TOP 1 id FROM [Pyszczek].[dbo].[Pets]
                Order by id desc;

                ------------------------END_SQL------------------------
                `
        )
        let {id:checkForHighestId} = dbData[0];

        //Insert new data to table against pattern
        //egz.: localhost:3000/insertNewPet?Like=pizza&pet=kot&name=Bobo
        console.log(req.query,checkForHighestId);
    let {like,pet,name:n} = req.query;
    
        let data = await pyszczekQuery(
            sql`
                ------------------------SQL----------------------------

                INSERT INTO  [Pyszczek].[dbo].[Pets] ([Like],[pet],[name])
                VALUES (${like},${pet.toString()},${n.toString()});

                ------------------------END_SQL------------------------
                `
        )
        console.log(await data);
        return res.send(data);
    }
}


