var express = require('express');
var session = require('express-session');
var app = express();

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));
app.use(session({secret : 'Session_ID_1'}));

var studentDetails = require('./routes/studentInfo.js');
app.use('/studentInfo',studentDetails);

var defaultPage = require('./routes/index.js');
app.use('/',defaultPage);

app.get('/*',function(req,res){

  res.send('No information available');

});

app.listen(8080);
