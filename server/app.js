
var requireConfig = require('./require-config');

global.appRequire = function(alias){    
    return require(__dirname + '/' +requireConfig[alias.toLowerCase()]);
};

// load all models into memory
Object.keys(requireConfig).forEach(function (alias){
    if(alias.indexOf('model.') > -1){
        appRequire(alias);
    }
});

var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var mongoose = require('mongoose');

var config = appRequire('config');

mongoose.connect(config.mongo.uri);

var ResponseUtils = appRequire('utils.response');
var app = express();

// Middlewares

app.use(bodyParser.json({limit: '5mb'}));
// use the compression module to ensure compression of responses for better load times
app.use(compression());

// Express Routing
require('./routes')(app);

var server = http.createServer(app);

server.listen(config.port, config.host, function(){
    console.log('Server started on PORT : ' + config.port + ' HOST : ' + config.host);
});


process.on('SIGTERM', onServerEnd);

function onServerEnd(){
    mongoose.connection.close();
    process.exit(0);
}
