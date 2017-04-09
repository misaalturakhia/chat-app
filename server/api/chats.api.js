var Router = require('express').Router();

var Controller = appRequire('ctrl.chats');

Router.post('/upload', Controller.uploadChats); // upload chats from whatsapp text file

// Router.get('/');

module.exports = Router;
