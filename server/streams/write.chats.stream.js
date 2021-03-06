var util = require('util');
var Writable = require('stream').Writable;

try{
    var Chat = appRequire('model.chat');
}catch (err){
    var Chat = require('../models/chat.model');
}

var BATCH_INSERT_SIZE = 100; // the batch size for writes to mongo

util.inherits(WriteChats, Writable);
function WriteChats(userId, conversationId){
    this.userId = userId;
    this.conversationId = conversationId;
    this.batch = [];
    this.metas = {
        messagers : new Set(),
        total_chats : 0
    };
    Writable.call(this, { objectMode : true });
    // handle the end of this writable stream
    this.on('finish', function (){
        this.writeBatch();
    });
}

WriteChats.prototype._write = function (chatObj, encoding, cb){
    var _this = this;
    // if the chat object has neither a message or messager
    if(!chatObj.messager || !chatObj.message){
        return cb();
    }

    var chat = new Chat(chatObj);
    // the user of the application who has uploaded this chat message
    chat.user_id = _this.userId;
    // the conversation this chat message belongs to 
    chat.conversation_id = _this.conversationId;
    // add the person who wrote this message to the set of messagers for this conversation
    _this.metas.messagers.add(chat.messager);
    // increment the total number of chats added
    _this.metas.total_chats += 1;
    // if the batch has not reached the limit, push to the batch and move to the next operation
    if(this.batch.length < BATCH_INSERT_SIZE){
        this.batch.push(chat);
        return cb();
    }else {
        this.writeBatch(function (err){
            if(err){
                console.log(err);
            }
            return cb();
        });
    }
};

// write the stored batch of chats
WriteChats.prototype.writeBatch = function (cb){
    cb = cb || function (){};
    // make a copy of the batch of documents
    var batch = this.batch.slice();
    // reset the batch array to empty
    this.batch = [];
    // insert the batch of documents
    Chat.collection.insertMany(batch, { ordered : false }, function (err, results){
        if(err){
            return cb(err);
        }
        return cb();
    });
};

module.exports = WriteChats;