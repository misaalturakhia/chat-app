var multer = require('multer');

module.exports = {
    uploadChats : uploadChats,
};

function uploadChats(req, res){
    var upload = multer().single('avatar');
    upload(req, res, function (err){
        
    });
}