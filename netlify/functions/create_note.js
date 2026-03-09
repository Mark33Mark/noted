import {connection} from "./utils/db_connection";
import {uuid} from "./helpers/uuid";

// ------------------------------------------------------------

const fgCyan = "\x1b[36m";
const fgReset = "\x1b[0m";

// ------------------------------------------------------------

export const handler = async (event, context) => {

  context.callbackWaitsForEmptyEventLoop = false;

  const { local_timezone, title, text } = JSON.parse(event.body);

  const options = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
    timeZone: local_timezone,
    timeZoneName: 'short'
  };

  const today = new Date();
  const local_timestamp = new Intl.DateTimeFormat('en-AU', options).format(today);

  console.log('local_timezone = ', local_timezone);

  const payload =
  {
    note_id: uuid(),
    date: local_timestamp,
    title: title,
    text: text
  };



  let sql_query = "INSERT INTO `not3d`(`note_id`, `date`, `title`, `text`) VALUES ";

  let query_parameters =
    "( \"" +
    payload.note_id +
    " \" , \"" +
    payload.date +
    " \" , \"" +
    payload.title +
    " \" , \"" +
    payload.text +
    "\" )";

  sql_query += query_parameters;

  try {

        const result = await connection.execute(sql_query);

        console.log("SQL_QUERY = ", sql_query);

        // await connection.end();
    
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(`🙌 Note added successfully 🙌`)
        };


  } catch (e) {
    console.log('There is a problem communicating with the Not3d database: ', e);
  }
}
