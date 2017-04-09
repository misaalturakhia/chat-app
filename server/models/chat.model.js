var mongoose = require('mongoose');

var mongooseUtils = require('./mongoose.utils');

var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    // identifier that allows bunching of chat documents by 
    user_id : String,
    // identifier that allows bunching of chat document by file upload id --> conversation id
    conversation_id : String, // a uuid
    // a conversation name
    conversation_name : String,
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