
const express   = require( "express" );
const path      = require( "path" );
const { clog }  = require( "./middleware/clog" );
const api       = require( "./routes/index" );

// const PORT = process.env.port || 8888;

// https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment
let port = process.env.PORT;
    if ( port === null || port === undefined || port === "" ) port = 8888;

const app = express();

// Imports custom middleware, "cLog"
app.use( clog );

// The middleware for parsing JSON and urlencoded form data
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

app.use( "/api", api );

app.use( express.static( "public" ) );

// GET Route for homepage
app.get( "/", ( req, res ) =>
    res.sendFile( path.join( __dirname, "/public/index.html" ))
);

// GET Route for notes page
app.get( "/notes", ( req, res ) =>
    res.sendFile( path.join(__dirname, "/public/notes.html" ))
);

// Wildcard to direct all undefined end points back to the homepage
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);


app.listen(port, () => console.log( `\n👂 Listening at http://localhost:${port}  👂\n`));


