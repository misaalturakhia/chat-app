var fs = require('fs');

var analyser = new require('./text.analyse.stream')();

var readStream = fs.createReadStream('../../whatsapp-chat.txt');

readStream.pipe(analyser).on('data', function (chat){
    console.log('---------------');
    console.log(JSON.stringify(chat, null, 2));
    console.log('---------------');
});