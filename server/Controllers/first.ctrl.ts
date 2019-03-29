import { pyszczekQuery } from '../db';
import { sql } from '../Tagged_Templates/sql_literals';


export namespace ctrl {
    //*** Get all elements in table */
    export const getAll = async (req, res) => {

        let num = `2`
        let data = await pyszczekQuery(
            sql`     
                    SELECT TOP ${num} *
                    FROM [Pyszczek].[dbo].[Pets]
                    ORDER BY id desc;
                `
        )
        console.log(data);
        return res.send(data)
    }

    export const getOldest = async (req, res) => {
        let data = await pyszczekQuery(
            sql`
                SELECT TOP 1 [name] FROM [Pyszczek].[dbo].[Pets]
                ORDER by age desc;
                `
        )
        console.log(data);
        return res.send(data);
    }
}


