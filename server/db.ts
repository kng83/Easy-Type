import * as sqll from 'mssql';
import * as msnodesqlv8 from 'mssql/msnodesqlv8';


const config: sqll.config = {
    user: 'sa',
    password: '12345',
    server: 'localhost',
    port:49714,
    database: 'Pyszczek',
    connectionTimeout: 10000,
    options: {
        trustedConnection: true
    }
};

function sql(payload:any){
    return payload;
}

(async () => {
    try {
        const  connection = await new sqll.ConnectionPool(config);
        await  connection.connect();
        connection
        const result = await connection.query(
            sql`SELECT TOP 10 *
             FROM [Pyszczek].[dbo].[Pets]
             ORDER BY id desc;`);

        console.log(result.recordset, 's');

    } catch (err) {
        // ... error checks
        console.log(err.message);
    }
})();



// async function test_msnodesqlv8() {
//     const connection = new msnodesqlv8.ConnectionPool(config);
//     await connection.connect();
//     const result = await connection.query
//     `SELECT TOP 10 *
//      FROM [Pyszczek].[dbo].[Pets]
//        ORDER BY id desc;`;
//     await connection.close();
// }