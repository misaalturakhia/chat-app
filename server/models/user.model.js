var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    // identifier that allows bunching of chat documents by 
    user_id : String,

    name : String,
    // v2
    email : String,
    // v2
    password : String,
    
    conversations : [{
        _id : String, // conversation id
        name : String,
    }]
});

module.exports = mongoose.model('user', ChatSchema);