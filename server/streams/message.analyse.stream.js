var util = require('util');
var Transform = require('stream').Transform;

var Sentiment = require('sentiment');
var Moment = require('moment');

util.inherits(MessageAnalyser, Transform);
function MessageAnalyser(){
    Transform.call(this, { objectMode : true });
}

MessageAnalyser.prototype._write = function (chat, encoding, cb){
    var _this = this;
    var message = chat.message;
    if(!message){
        return cb();
    }
    chat.analysis = {};
    // append sentiment score of the message
    chat.analysis.sentiment_score = Sentiment(message).score;
    // words
    var words = chat.message.trim().split(' ');
    // filter words with no text
    words = words.filter(function (word){
        return word.length > 0;
    });
    chat.analysis.words = words;
    chat.analysis.word_count = words.length;
    // analyse date
    var date = Moment(chat.date_str, 'DD/MM/YYYY, HH:mm');
    // hour of day,
    chat.analysis.date = {};
    var dateData = chat.analysis.date;
    dateData.hour_of_day = date.hours();
    var day = date.day();
    dateData.day_of_week = fetchDayStr(day);
    _this.push(chat);
    return cb();  
};

function fetchDayStr(day){
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[day];
}

module.exports = MessageAnalyser;