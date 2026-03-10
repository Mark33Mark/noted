import { connection } from "./utils/db_connection";

const fgCyan = "\x1b[36m";
const fgReset = "\x1b[0m";

// ------------------------------------------------------------

export const handler = async (event, context) => {

  context.callbackWaitsForEmptyEventLoop = false;

  let sql_query = "DELETE FROM `not3d` WHERE `sql_id` = ? AND `note_id` = ?";

  const id = JSON.parse(event.body);
  console.log(id);

  console.info(`\n📕 \t ${fgCyan}${event.httpMethod} request to ${event.path}${fgReset} \t ➡️ \t 🙋 \n`);

  try {


        const [rows ] = await connection.execute(sql_query, [id.sql_id, id.note_id])
    
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(`Your note with id: ${id.note_id} has been deleted \t🗑️`)
        };

  } catch (e) {
    console.log('There is a problem communicating with the Not3d database: ', e);
  }
}
