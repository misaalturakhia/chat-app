
var path = require('path');
var express = require('express');

var config = appRequire('config');
var ResponseUtils = appRequire('utils.response');


module.exports = function(app) {

    // attach the chats api
    app.use('/api/chats', appRequire('api.chats'));
};
