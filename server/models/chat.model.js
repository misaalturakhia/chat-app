var mongoose = require('mongoose');

var mongooseUtils = require('./mongoose.utils');

var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    // id of the user who is using our app
    user_id : String,
    // person who sent the chat
    messager : {
        type : String,
    },
    // message of the chat
    message : {
        type : String
    },
    // timestamp of the chat
    timestamp : Date
});

module.exports = mongoose.model('chat', ChatSchema);