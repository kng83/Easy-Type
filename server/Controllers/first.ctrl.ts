import { pyszczekQuery } from '../db';
import { sql,s } from '../Tagged_Templates/sql_literals';


export namespace ctrl {

    //*** Get all elements in table */
    export const getAll = async (req, res) => {
        let data = await pyszczekQuery(
            sql`     
                ------------------------SQL-----------------------------

                SELECT  * 
                    FROM [Pyszczek].[dbo].[Pets]
                    ORDER BY id desc;

                 ------------------------END_SQL------------------------
                `
        )
        console.log(data);
        return res.send(data)
    }

    export const getOldest = async (req, res) => {
        let data = await pyszczekQuery(sql`
                ------------------------SQL----------------------------

                SELECT TOP 1 [name] FROM [Pyszczek].[dbo].[Pets]
                ORDER by id desc;

                ------------------------END_SQL------------------------
                `)
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

        let {id:checkForHighestId} = (await pyszczekQuery(sql`
                ------------------------SQL----------------------------

                SELECT TOP 1 id FROM [Pyszczek].[dbo].[Pets]
                Order by id desc;

                ------------------------END_SQL------------------------
                `))[0]

        console.log(checkForHighestId)
        //Insert new data to table against pattern
        //egz.: localhost:3000/insertNewPet?Like=pizza&pet=kot&name=Bobo

    let {Like:like,pet,name} = req.query;
    
        let data = await pyszczekQuery(sql`
                ------------------------SQL----------------------------

                INSERT INTO  [Pyszczek].[dbo].[Pets] ([Like],[pet],[name])
                VALUES (${s(like)}, ${s(pet)}, ${s(name)});

                ------------------------END_SQL------------------------
                `)
        console.log(data);
        return res.send(data);
    }
}


