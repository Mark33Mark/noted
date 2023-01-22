const db_connect = require( "./utils/db_connection.js" );
const sql_query = "SELECT * FROM not3d";

const fgCyan  = "\x1b[36m";
const fgReset = "\x1b[0m";

// ------------------------------------------------------------

exports.handler = ( event, context, callback ) => {

  context.callbackWaitsForEmptyEventLoop = false;

  console.info( `\n📗 \t ${fgCyan}${event.httpMethod} request to ${event.path}${fgReset} \t ➡️ \t 🤗 \n` );

  try {

    db_connect.getConnection(function(err, connected) {

      connected.execute( sql_query, (error, results) => {

      if (error){ 

        console.log('calling callback with error')
        callback(error);

      } else {

          callback( null, {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(results)
          })
        }
      })

    if(err) { console.log('db_connect error = ', err); }

  })
} catch (e) {
    console.log('There is a problem communicating with the Quotes database: ', e);
  }
}
