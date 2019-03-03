
import mssql from 'mssql'

let sql = mssql as any;

(async () => {
  try {
    await sql.connect('mssql://sa:12345@localhost:49714/Pyszczek'); //
    const result = await sql.query(
      `SELECT TOP 5
                [Name],[Age]
                FROM [Pyszczek].[dbo].[First]`);
    console.log(result.recordset);

    const second = await sql.query(
      `INSERT INTO [Pyszczek].[dbo].[First]
             VALUES ('Puszek',1);`
    )

  } catch (err) {
    // ... error checks
    console.log(err.message);//
  }
})();