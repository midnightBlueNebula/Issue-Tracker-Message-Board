'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var helmet            = require('helmet');

var MongoClient       = require('mongodb').MongoClient;
var ObjectId          = require('mongodb').ObjectID;


const CONNECTION_STRING = process.env.DATABASE;


var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(helmet.xssFilter());
//Sample front-end


//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
 
    
//404 Not Found Middleware

MongoClient.connect(CONNECTION_STRING, function(err, client) {
  const db = client.db('cluster0');
  if(err){
    console.log('Error -> ',err)
  }
  else{
    console.log('Connected to database successfully');
  }
  
  apiRoutes(app,db);
  
  
  
  
  
  
  
  
  
  app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
  })
  
  app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 3500);
    }
  })
  
});




//Start our server and tests!


module.exports = app; //for testing
