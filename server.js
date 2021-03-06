// CONFIGURE BIND TARGET
//    node server.js 1234 (bind to port 1234 with INADDR_ANY)
//    node server.js /tmp/clue.socket (bind to local unix socket)
//    node server.js (bind to port 8888 by default)
var bind = 8888;
if (process.argv[2]) {
  bind = process.argv[2];
}

// INCLUDE LIBRARIES
var http    = require('http'),
    sqlite3 = require('sqlite3'),
    url     = require('url');

// SERVER DEFINITION
function clue(request, response) {
  var payload = {
    status: "error",
    message: "",
    results: [],
    pattern: ""
  };
  var headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };
  // open the database file; check for errors
  var db = new sqlite3.Database('dictionary.db', sqlite3.PEN_READWRITE, function(error){
    if (error !== null) {
      wraplog('ERROR: opening the dictionary.db file gave this msg: '+ error);
      response.writeHead(500, headers);
      payload.message('Uh oh, server error. Time to check the logs.');
      response.end(jsonificate(payload));
    }
  });

  if (
    url.parse(request.url).pathname == '/search' &&
    url.parse(request.url, true).query.pattern !== undefined
  ){
    // valid request with a pattern param, so run an sqlite query
    payload.pattern = url.parse(request.url, true).query.pattern;
    wraplog('Search request for pattern: ' + payload.pattern);
    payload.pattern = payload.pattern.replace(/[^a-zA-Z]/g, "_"); // non-alpha chars -> sqlite wildcard
    wraplog('Sanitised pattern: ' + payload.pattern);

    var query = db.prepare('SELECT word FROM words WHERE word LIKE ?');
    response.writeHead(200, headers);
    query.each(payload.pattern, function(error, row){
      // callback - this function is called for every row result in the query
      if (error === null) {
        payload.results.push(row.word);
      } else {
        wraplog('ERROR: query.each: '+ error);
      }
    },function(error, row_count) {
      // completion - this function is called when all rows have been returned
      if (row_count > 500) {
        payload.message = "ERROR: too many results ("+ row_count +")"; 
        wraplog(payload.message);
        payload.results = []; // building the huge JSON object consumes all memory
      } else {
        payload.status = "ok";
        payload.message = "Found: "+ row_count;
      }
      response.end(jsonificate(payload));
    });
  } else {
    // HACK: return generic 500 for anything we can't handle
    response.writeHead(500, headers);
    payload.message = "Requesting resource "+ url.parse(request.url).path +" is not supported.";
    wraplog('ERROR: '+ payload.message);
    response.end(jsonificate(payload));
  }

  // wrap the JSON.stringify method to handle jsonp
  function jsonificate(obj) {
    var callback = url.parse(request.url, true).query.callback;
    if (callback === undefined) {
      return JSON.stringify(obj);
    } else {
      return callback +'([ '+ JSON.stringify(obj) +']);';
    }
  }

  // convenience function: I like client ip for debugging
  function wraplog(msg) {
    console.log('['+ request.connection.remoteAddress +'] '+ msg);
  }
}

// START THE HTTP SERVER
http.createServer(clue).listen(bind);
console.log('Started clue server on ' + bind);
