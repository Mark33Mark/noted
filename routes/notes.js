const noted     = require( "express" ).Router();
const path      = require('path');
const uuid      = require( "../helpers/uuid" );

const {
  readFromFile,
  readAndAppend,
  writeToFile,
  }             = require( "../helpers/fsUtilities" );

// ================================================================================================

// GET Route for retrieving all the noteS
noted.get( "/", ( req, res ) => {
  readFromFile( "./db/notes.json" ).then((data) => res.json(JSON.parse(data)));
});

// ================================================================================================

// GET Route for a specific note
noted.get("/:id", ( req, res ) => {

  const noteId = req.params.note_id;
  
  readFromFile("./db/notes.json")

    .then(( data ) => JSON.parse( data ))
    .then(( json ) => {
      console.log( json );
      const result = json.filter(( note ) => note.note_id === noteId);
      return result.length > 0
        ? res.json( result )
        : res.json( "There is no note with that ID" );
    });
});


// ================================================================================================

let adjustedNumber = ( num, size ) => {
  let s = "00" + num;
  return s.substr(s.length-size);
};

// POST Route for a new note
noted.post( "/", ( req, res ) => {
  
  console.log( req.body );

  // Thanks again to stackoverflow for speeding up the problem solving process, amazing resource.
  // https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
  
  const today         = new Date(),
        currentHour   = adjustedNumber(today.getHours(), 2),
        currentMinute = adjustedNumber(today.getMinutes(), 2),
        currentSecond = adjustedNumber(today.getSeconds(), 2);

  const timestamp = today.getDay() + "." + today.getMonth()+ "." + today.getFullYear()+ " @ " + 
                    currentHour + ":" + currentMinute + ":" + currentSecond;

  const { title, text } = req.body;

  if ( req.body ) {
    const newNote = {
      note_id: uuid(),
      date: timestamp,
      title,
      text,
    };

    readAndAppend(newNote, "./db/notes.json" );
    res.json( `🙌 Note added successfully 🙌`);
    } else {
    res.error( "There was a problem adding your note. 😞" );
  }
});

// ================================================================================================

// DELETE Route for a specific note
noted.delete( "/:note_id", ( req, res ) => {
  
  const noteId = req.params.note_id;
  
  readFromFile( "./db/notes.json" )
    .then( ( data ) => JSON.parse( data ) )
    .then( ( json ) => {
      
      // Make a new array of all notes except the one with the ID provided in the URL
      console.log( json );
      const result = json.filter( ( note ) => note.note_id !== noteId );

      // Save that array to the filesystem
      writeToFile( "./db/notes.json", result );

      // Respond to the DELETE request
      res.json( `Your note with id: ${noteId} has been deleted \t🗑️` );

    });
});

// ================================================================================================

module.exports = noted;

// ================================================================================================