var express = require('express');
var htmlfile = "index.html";

var app = express.createServer(express.logger());
var fs = require('fs');
/*
app.get('/', function(request, response) {
  response.send('Hello World 2!');
});
*/

app.get('/', function(request, response) {
  var html = fs.readFileSync(htmlfile).toString();
  response.send(html);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
