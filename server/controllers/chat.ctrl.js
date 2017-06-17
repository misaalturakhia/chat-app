var multer = require('multer');

var ResponseUtils = appRequire('utils.response');
var MulterChatStorage = appRequire('utils.multer.chat.storage');

var CHAT_UPLOAD_FILE_NAME = 'chats';

var Uploader = multer({
    storage : new MulterChatStorage(),
    limits : {
        fileSize : 5e+7 // 5 Mb
    }
}).single(CHAT_UPLOAD_FILE_NAME);

module.exports = {
    upload : upload,
    getOverview : getOverview,
    getPersonal : getPersonal
};

function upload(req, res){
    Uploader(req, res, function (err){
        if(err || !req.file){
            return res.json(ResponseUtils.responseError(err));
        }
        console.log(JSON.stringify(req.file, null, 2));
        var messagers = req.file.messagers;
        var totalChats = req.file.total_chats;
        return res.json(ResponseUtils.responseSuccess({ messagers : messagers, total : totalChats }));
    });
}

function getOverview(req, res){
    // todo
}

function getPersonal(req, res){
    // todo
}