var util = require('util');
var Writable = require('stream').Writable;

var Chat = appRequire('model.chat');

util.inherits(WriteChats, Writable);
function WriteChats(userId, conversationName, conversationId){
    this.userId = userId;
    this.conversationName = conversationName;
    this.conversationId = conversationId;
    Writable.call(this, { objectMode : true });
}

WriteChats.prototype._write = function (chatObj, encoding, cb){
    var chat = new Chat();
    chat.user_id = this.userId;
    chat.conversation_name = this.conversationName;
    chat.conversation_id = this.conversationId;
    chat.save(function (err){
        if(err){
            console.log(err)
        }
        return cb();
    });
};

module.exports = WriteChats;