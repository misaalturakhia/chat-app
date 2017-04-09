var path = require('path');

var _ = require('lodash');

var environment = process.env.NODE_ENV || 'development';


var config = {
    
    root : path.normalize(__dirname + './../../../'),

    port : 5000,
    host : '0.0.0.0',
};

module.exports = _.assign(config, require('./' + environment));