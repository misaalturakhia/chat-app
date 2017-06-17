var Router = require('express').Router();

var Controller = appRequire('ctrl.chat');

Router.post('/:cid', Controller.upload); // upload chats from whatsapp text file

// Router.get('/:cid/base', Controller.getBase); // get the base data about the conversation

Router.get('/:cid/overview', Controller.getOverview); // overall insights about the chat

Router.get('/:cid/personal', Controller.getPersonal); // 

module.exports = Router;
