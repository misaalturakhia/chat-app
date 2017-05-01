var mongoose = require('mongoose');

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
    timestamp : Date,

    date_str : String,

    analysis : {
        sentiment_score : Number,
        word_count : Number, // in words
        words : [],
        emoticons : [],
        entities : { // mentioned entities
            people : [ String ],
            locations : [ String ],
            organisations : [ String ]
        },
        date : {
            day_of_week : {
                type : String,
                enum : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            },
            hour_of_day : Number,
        }
    }
});

module.exports = mongoose.model('chat', ChatSchema);