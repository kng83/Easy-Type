import * as mssql from 'mssql';
import * as msnodesqlv8 from 'mssql/msnodesqlv8';
import {sql} from './Tagged_Templates/sql_literals';


const config: mssql.config = {
    user: 'sa',
    password: '12345',
    server: 'localhost',
    port: 49714,
    database: 'Pyszczek',
    connectionTimeout: 10000,
    options: {
        trustedConnection: true
    }
};


(async () => {
    try {
        const connection = await new mssql.ConnectionPool(config);
        await connection.connect();

        let nrOfSelectedItems = 13;
        const result = await connection.query(
            sql`
                --some pseudo code
                /*all and one */      
                SELECT TOP ${nrOfSelectedItems} *
                FROM [Pyszczek].[dbo].[Pets]
                ORDER BY id desc;
            `)
        ;
        console.log(result.recordset);
        connection.close();

    } catch (err) {
        // ... error checks
        console.log(err.message);
    }
})();
