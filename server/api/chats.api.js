var Router = require('express').Router();

var Controller = appRequire('ctrl.chats');

Router.post('/:cid', Controller.uploadChats); // upload chats from whatsapp text file

Router.get('/:cid/base', Controller.getBase); // get the base data about the conversation

Router.get('/:cid/overview', Controller.getOverview);

Router.get('/:cid/personal', Controller.getPersonal);

// Router.get('/');

module.exports = Router;
