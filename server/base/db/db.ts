import {MongoClient} from "mongodb";
import "../../config/env";
import {log} from "../../config/app.config";


//***Connect to specific database */
export async function dbConnected() {
  return dbConnection(process.env.DB_LOCAL_URL || "mongodb://localhost:27017",
    process.env.DB_NAME || "driver");
}

//***Test Database connection */
export async function testConnectionToDb() {
  return testDbConnection(process.env.DB_LOCAL_URL || "mongodb://localhost:27017",
    process.env.DB_NAME || "driver");
}

//*** Return database object
export async function dbConnection(databaseUrl: string, databaseName: string) {
  try {
    const fullUrl = `${databaseUrl}/${databaseName}`;
    console.log(fullUrl);

    //*** Main connection
    const dbClient = await MongoClient.connect(fullUrl, {useNewUrlParser: true, reconnectTries: 30, autoReconnect: true});
    const db = dbClient.db(databaseName);

    db.on("reconnect", () => log.info("reconnect"));
    db.on("close", () => log.info("database close"));
    return db;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function testDbConnection(databaseUrl: string, databaseName: string) {
  try {
    const fullUrl = `${databaseUrl}/${databaseName}`;

    //*** Make a test connection and close it after success
    const dbClient = await MongoClient.connect(fullUrl, {
      reconnectTries: 0,
      autoReconnect: false,
      reconnectInterval: 200,
      useNewUrlParser: true
    });

    const db = dbClient.db(databaseName);
    // this command doesn't work on mlab
    try {
      const status = await db.command({serverStatus: 1});
      console.log(status.version);
    } catch (e) {
      console.log(e.message);
    }

    await dbClient.close();
    return {status: true, message: "Connection Ok"};

  } catch (err) {
    return Promise.reject(err);
  }
}




