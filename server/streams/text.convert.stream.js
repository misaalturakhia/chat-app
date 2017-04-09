var util = require('util');
var stream = require('stream');
var Transform = stream.Transform;

var Moment = require('moment');

module.exports = TextConverter;

util.inherits(TextConverter, Transform);

/**
 * A stream that reads the whatsapp chat text file and converts to objects
 * @param {*} opts 
 */
function TextConverter(opts){
    if (!(this instanceof TextConverter)) {
        return new TextConverter(opts);
    }
    this.temp = ''; // a temporary variable that holds an unfinished line
    opts = opts || {}; // todo : pass in buffer size
    opts.objectMode = true;
    opts.highWaterMark = 2000; // in bytes
    Transform.call(this, opts);
}

// implement the transform method to implement a transform stream 
TextConverter.prototype._transform = function (chunk, encoding, cb){
    var _this = this;
    // fetch the chunk of chats
    var chatStr = chunk.toString();
    // split the chunk up into an array of lines (incomplete line goes in temp)
    var chats = _this.splitTextToLines(chatStr, []);
    // for each line/chat
    chats.forEach(function(chat) {
        // parse the line
        var chatDoc = _this.toObject(chat);
        // if null is passed back, ignore
        if(!chatDoc){
            return;
        }
        // push the parsed object that contains the data in the line (timestamp, user, message)
        _this.push(chatDoc);
    });
    return cb();
};

// recursively split the text into lines
TextConverter.prototype.splitTextToLines = function (chatStr){
    var _this = this;
    var chats = chatStr.split('\n');
    // add temp
    chats[0] = _this.temp + chats[0];
    var lastIndex = chats.length - 1;
    var lastChat = chats[lastIndex];
    // handling case where the last character is not a \n`
    if(lastChat.length > 0){ 
        // add that last incomplete chat to temp
        _this.temp = lastChat || '';
    }else {
        // make temp blank
        _this.temp = '';
    }
    // remove the last element (in the case that the line is complete, remove the blank str caused by last char \n. In the case that the line 
    //is incomplete, dont include it in the chats array )
    chats.splice(lastIndex); // remove the last chat
    return chats;
};

TextConverter.prototype.toObject = function (chat){
    var _this = this;
    // split by ' - ' --> date on the left, chat name and message on the right
    var chatObj = {};
    // find te first index of the : string - (separates the date and the message data)
    var separator = ' - ';
    var separatorIndex = chat.indexOf(separator);
    // handle no colon found -- invalid whatsapp text file format
    if(separatorIndex < 0){
        return null;
    }
    var chatDate = chat.substring(0, separatorIndex);
    var chatData = chat.substring(separatorIndex + separator.length, chat.length - 1);
    // parse date from the passed chat date string
    var date = _this.fetchDate(chatDate);
    // inject the parsed data into the final chat obj
    chatObj.timestamp = date;
    // use the chatData string to extract the messager and the message and inject it into the chatObj
    _this.appendChatData(chatObj, chatData);
    return chatObj;
};

// TODO : HANDLE dates with different formats based on locales ?
TextConverter.prototype.fetchDate = function (dateStr){
    // expect string like '04/08/2015, 23:49'
    if(!dateStr){
        return null;
    }
    dateStr = dateStr.trim();
    // parse string into date object using momentjs and passing the expected string date format
    var date = Moment(dateStr, 'DD/MM/YYYY, HH:mm');
    return date;
};

TextConverter.prototype.appendChatData = function (chatObj, chatDataStr){
    // eg : chatDataStr = Misaal Turakhia: misaal.turakhia@gmail.com
    var separator = ': '; // separates the messenger from the message
    var separatorIndex = chatDataStr.indexOf(separator);
    // if the separator was found in the chat data string
    if(separatorIndex > -1){
        // the person who wrote the message
        chatObj.messager = chatDataStr.substring(0, separatorIndex);
        // the message that was passed
        chatObj.message = chatDataStr.substring(separatorIndex + separator.length, chatDataStr.length - 1);
    }
    return chatObj;
};