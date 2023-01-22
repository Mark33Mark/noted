const db_connect = require( "./utils/db_connection.js" );

const fgCyan = "\x1b[36m";
const fgReset = "\x1b[0m";

// ------------------------------------------------------------

exports.handler = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  let sql_query = "DELETE FROM `not3d` WHERE `sql_id` = ? AND `note_id` = ?";

  const id = JSON.parse(event.body);
  console.log(id);

  console.info( `\n📕 \t ${fgCyan}${event.httpMethod} request to ${event.path}${fgReset} \t ➡️ \t 🙋 \n` );

  try {

    db_connect.getConnection(function(err, connected) {

      connected.execute( sql_query, [id.sql_id, id.note_id], ( error, result) => {

      if (error){ 

        console.log('calling callback with error')
        callback(error);

      } else {

        if(result.length === 0){
          console.log("quote not in database, add it?");
          }
        
        console.log(result)

          callback( null, {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(`Your note with id: ${id.note_id} has been deleted \t🗑️` )
            })
        }
      })

    if(err) { console.log('db_connect error = ', err); }

  })
} catch (e) {
    console.log('There is a problem communicating with the Quotes database: ', e);
  }
}
