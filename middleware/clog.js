
// Custom middleware that logs out the type and path of each request to the server
const clog = ( req, res, next ) => {

  const fgCyan = "\x1b[36m";
  const fgReset = "\x1b[0m";

  switch ( req.method ) {
    case 'GET': {
      console.info( `š ${fgCyan}${req.method} request to ${req.path}${fgReset}\tš¤` );
      break;
    }
    case 'POST': {
      console.info( `š ${fgCyan}${req.method} request to ${req.path}${fgReset}\tš` );
      break;
    }
    case 'DELETE': {
      console.info( `š ${fgCyan}${req.method} request to ${req.path}${fgReset}\tš` );
      break;
    }
    default:
      console.log( `š${fgCyan}${req.method} request to ${req.path}${fgReset}\tš` );
  }
  next();
};

exports.clog = clog;
