var express  = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json({
  extended: true
}));

var http = require('http').Server(app);
var port = process.env.PORT || 8080;

http.listen(port, function(){
  console.log('The magic happens on port ' + port);
});

require('./app/routes.js')(app);

