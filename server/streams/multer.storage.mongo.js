var User = appRequire('model.user');
var Chat = appRequire('model.chat');

var Converter = appRequire('stream.text.converter');
var ChatWriter = appRequire('stream.write.chats');

// implementing a custom storage engine in mongo
function MongoStorage(){}

// invoked when a file is uploaded
MongoStorage.prototype._handleFile = function (req, file, cb){
    var userId = req.user._id;
    var conversationName = req.query.cname;
    var conversationId = req.params.cid;

    var converter = new Converter();
    var chatWriter = new ChatWriter(userId, conversationName, conversationId);
    chatWriter.on('error', function (err){
        return cb(err);
    });
    chatWriter.on('finish', function (){
        var updateObj = {
            $addToSet : {
                'conversations' : {
                    _id : conversationId,
                    name : conversationName
                }
            }
        };
        User.update({ _id : userId }, updateObj, { upsert : true }).exec();
        return cb();
    });
    // pipe the file contents to the converter and then further pipe to the stream that writes to mongo
    file.stream.pipe(converter).pipe(chatWriter);
};

// 
MongoStorage.prototype._removeFile = function (req, file, cb) {
    var userId = req.user._id;
    var conversationId = req.params.cid;
    // remove all chats withe the input conversationId and then remove the conversation from the User document
    Chat.remove({ conversation_id : conversationId }).exec(function (err){
        if(err){
            return cb(err);
        }
        User.update({ _id : userId }, { $pull : { conversations : { _id : conversationId } } }).exec(function (err){
            if(err){
                return cb(err);
            }
            return cb();
        });
    });
};

module.export = MongoStorage;