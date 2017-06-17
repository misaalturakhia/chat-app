var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Names = require('./collection.names');

var UserSchema = new Schema({
    
    is_active : {
        type : Boolean,
        default : true
    },

    // identifier that allows bunching of chat documents by 
    _id : String,

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

module.exports = mongoose.model(Names.user, UserSchema);