var express = require('express');
var sqlite3 = require('sqlite3');
var dict = new sqlite3.Database('dictionary.db', sqlite3.PEN_READWRITE);

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    dict.get("SELECT COUNT(*) AS count FROM dict", function(err, row) {
      response.send('Dictionary row count: ' + row.count);
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
