
var User = appRequire('model.user');

var ResponseUtils = appRequire('utils.response');

module.exports = {
    update : update,
};

function update(req, res){
    var id = req.params.id;
    var user = req.body;
    User.findByIdAndUpdate(id, { $set : user }).exec(function (err){
        if(err){
            return res.json(ResponseUtils.responseError(err));
        }
        return res.json(ResponseUtils.responseSuccess());
    });
}

