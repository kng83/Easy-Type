
import * as mysql from 'mysql2';


export const pool: mysql.PoolOptions = {
    host: 'localhost',
    user: 'pawel',
    password: '12345',
    database: 'alarmdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const promisePool = connectMysql(pool);


async function connectMysql(mySqlPool: mysql.PoolOptions) {
    const pool = await mysql.createPool(mySqlPool)
    return  pool.promise();
}



export const executeStandardQuery = async function(sqlText:string){
     let pool = await promisePool;
     let queryResult = await pool.query(sqlText);
     return queryResult[0];
}

