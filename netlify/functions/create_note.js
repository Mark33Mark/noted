const db_connect = require( "./utils/db_connection.js" );
const uuid    = require( "./helpers/uuid" );

// ------------------------------------------------------------

const fgCyan = "\x1b[36m";
const fgReset = "\x1b[0m";

// ------------------------------------------------------------

exports.handler =  ( event, context, callback ) => {

  context.callbackWaitsForEmptyEventLoop = false;

  const options = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
    timeZone: 'Australia/Sydney',
    timeZoneName: 'short'
  };

  const today   = new Date();
  const local_timestamp = new Intl.DateTimeFormat('en-AU', options).format(today);

  const { title, text } = JSON.parse(event.body);

  const payload = 
    {
      note_id: uuid(),
      date: local_timestamp,
      title: title,
      text: text
    };

  let sql_query = "INSERT INTO `not3d`(`note_id`, `date`, `title`, `text`) VALUES ";
  
  console.log(payload);

  let query_parameters = 
      "( \""          + 
      payload.note_id + 
      " \" , \""      + 
      payload.date    +
      " \" , \""      +  
      payload.title   + 
      " \" , \""      + 
      payload.text    + 
      "\" )";
  
  sql_query += query_parameters;

  console.log("sql_query = ", sql_query);
  
  try {

    db_connect.getConnection(function(err, connected) {

      connected.execute( sql_query, ( error, result) => {

      if (error){ 

        console.log('calling callback with error')
        callback(error);

      } else {

        if(result.length === 0){
          console.log("Note not in database, add it?");
          }
        
        console.log(result)

          callback( null, {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify( `🙌 Note added successfully 🙌` )
            })
        }
      })

    if(err) { console.log('db_connect error = ', err); }

  })
} catch (e) {
    console.log('There is a problem communicating with the Not3d database: ', e);
  }
}
