const db_connect = require( "./utils/db_connection.js" );
const uuid    = require( "./helpers/uuid" );

// ------------------------------------------------------------

const adjustedNumber = ( num, size ) => {
  let s = "00" + num;
  return s.substring(s.length-size);
};

const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fgCyan = "\x1b[36m";
const fgReset = "\x1b[0m";

// ------------------------------------------------------------

exports.handler =  ( event, context, callback ) => {

  context.callbackWaitsForEmptyEventLoop = false;

  const today   = new Date(),
  currentHour   = adjustedNumber( today.getHours(), 2 ),
  currentMinute = adjustedNumber( today.getMinutes(), 2 ),
  currentSecond = adjustedNumber( today.getSeconds(), 2 );

  const timestamp = "| " + Intl.DateTimeFormat().resolvedOptions().timeZone + " | on " +weekday[today.getDay()] + ". ➡️ " + adjustedNumber(today.getDate(),2) + "." + month[today.getMonth()]+ "." + today.getFullYear()+ " @ " + 
              currentHour + ":" + currentMinute + ":" + currentSecond;

  const { title, text } = JSON.parse(event.body);

  const payload = 
    {
      note_id: uuid(),
      date: timestamp,
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
      payload.test    + 
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
