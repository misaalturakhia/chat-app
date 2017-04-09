var mongoose = require('mongoose');

var mongooseUtils = require('./mongoose.utils');

var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    // identifier that allows bunching of chat documents by 
    user_id : String,

    name : String,
    
    conversations : [{
        _id : String, // conversation id
        name : String,
    }]
});

module.exports = mongoose.model('chat', ChatSchema);