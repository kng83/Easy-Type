import * as mssql from 'mssql';
import * as msnodesqlv8 from 'mssql/msnodesqlv8';
import { sql } from './Tagged_Templates/sql_literals';


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

//*** Change function async function into smaller function */
async function queryWrapper(config: mssql.config, queryString: any) {
    try {
        const connection = await new mssql.ConnectionPool(config).connect()
        const result = await connection.query(queryString)    
        connection.close();
        return result.recordset;

    } catch (err) {
        return err.message;
    }
}

export const  pyszczekQuery  = queryWrapper.bind(null,config);