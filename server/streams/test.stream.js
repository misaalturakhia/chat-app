var fs = require('fs');
var mongoose = require('mongoose');

var Converter = require('./text.convert.stream');
var ChatWriter = require('./write.chats.stream');
var Analyser =  require('./message.analyse.stream');

var readStream = fs.createReadStream('../../whatsapp-chat.txt');

mongoose.connect('mongodb://localhost/chatanalyser', function (err, db){
    if(err){
        return console.log(err);
    }
    console.log('connected');
    readStream.pipe(new Converter()).pipe(new Analyser()).pipe(new ChatWriter('12416r3gfbw', 'misaal'));
});