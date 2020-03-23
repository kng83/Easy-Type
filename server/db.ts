

import {Pool, PoolClient} from 'pg';



const pool = new Pool({
    host: 'localhost',
    user: 'pawel',
    password:'12345',
    database:'alarm_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

const mMap = new Map();
async function poolHolder():Promise<PoolClient>{
    try{
    if(!mMap.has('pool')){
       mMap.set('pool',pool.connect())
    }
    return mMap.get('pool');
    } catch(e){
        console.log(e.message);
    }
}

export const executeStandardQuery = async function(sqlText:string){
    try{
        let connectionPool = await poolHolder();
        let queryResult = await connectionPool.query(sqlText);
        return queryResult.rows;

    } catch (e){
        console.log(e.message);
    }
}

