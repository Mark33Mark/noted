import { connection } from "./utils/db_connection";

const sql_query = "SELECT * FROM not3d";

const fgCyan = "\x1b[36m";
const fgReset = "\x1b[0m";

// ------------------------------------------------------------

export const handler = async (event, context) => {

  context.callbackWaitsForEmptyEventLoop = false;

  console.info(`\n📗 \t ${fgCyan}${event.httpMethod} request to ${event.path}${fgReset} \t ➡️ \t 🤗 \n`);

  try {

    const [rows ] = await connection.execute(sql_query)

    // await connection.end();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rows)
    };


  } catch (e) {
    console.log('There is a problem communicating with the Not3d database: ', e);
  }
}
