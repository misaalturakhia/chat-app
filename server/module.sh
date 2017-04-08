# Author : Abhay N. Pai 
# Description : Bootstraping the module structure for Fork Projects
# 
# 
# 

# CLIENT_DIR='client/dashboard/app/modules';
# SERVER_DIR='server';

PACKAGE=$1;

MODULE=$2;

create_client_module()
{
	# Define Basic Variables
	CLIENT_DIR='client/dashboard/app/modules';

	SUFFIX_CTRL='Ctrl';
	SUFFIX_SRV='Srv';

	CONTROLLER_NAME=$MODULE$SUFFIX_CTRL;
	SERVICE_NAME=$MODULE$SUFFIX_SRV;

	
	# Create client dir
	mkdir $CLIENT_DIR/$MODULE;
	
	# Create the necessary files
	touch $CLIENT_DIR/$MODULE/$MODULE.ctrl.js;
	touch $CLIENT_DIR/$MODULE/$MODULE.md.js;
	touch $CLIENT_DIR/$MODULE/$MODULE.srv.js;
	touch $CLIENT_DIR/$MODULE/$MODULE.html;

	# Fill up the content for each files
	echo "
'use strict';

define([

], function(){
	
	function $CONTROLLER_NAME() {

	};

	$CONTROLLER_NAME.\$inject = [];

	return $CONTROLLER_NAME;

});
	" > $CLIENT_DIR/$MODULE/$MODULE.ctrl.js;

	echo "
'use strict';

define([
	'$CONTROLLER_NAME',
	'staticRequire'
], function($CONTROLLER_NAME, staticRequire){
	
	return {
		templateUrl : staticRequire.getHtml('$MODULE'),
		controller : $CONTROLLER_NAME,
		controllerAs : '$CONTROLLER_NAME'
	};

});
	" > $CLIENT_DIR/$MODULE/$MODULE.md.js;

	echo "
'use strict';

define([

], function(){

	function $SERVICE_NAME(Restangular) {

		return {

		};
	};

	return $SERVICE_NAME;

});
	" > $CLIENT_DIR/$MODULE/$MODULE.srv.js;

	echo "
<div></div>
	" > $CLIENT_DIR/$MODULE/$MODULE.html;

}


create_server_module()
{
	# Define Basic Variables

	API_DIR='server/api/';
	CONTROLLER_DIR='server/controller/';

	API_FILE_NAME=$API_DIR$MODULE'.api.js';
	CONTROLLER_FILE_NAME=$CONTROLLER_DIR$MODULE'.ctrl.js';

	MODULE_CAP="$(tr '[:lower:]' '[:upper:]' <<< ${MODULE:0:1})${MODULE:1}";

	touch $CONTROLLER_FILE_NAME;
	touch $API_FILE_NAME;

	echo "
var lodash = require('lodash');

var ${MODULE_CAP} = appRequire('model.$MODULE');
var ResponseUtils = appRequire('utils.response');

function getAll(req, res, next) {

	${MODULE_CAP}.find({}).exec(function(err, ${MODULE}s) {
		if(err) {
			return res.json(ResponseUtils.responseError(err));
		}

		return res.json(ResponseUtils.responseMessage(true, 'success', ${MODULE}s));
	});

};

function getOne(req, res, next) {

	var ${MODULE}Id = req.params.id;
	
	if(!${MODULE}Id) {
		return res.json(ResponseUtils.responseMessage(false, 'error', null));
	}

	${MODULE_CAP}.findById(${MODULE}Id).exec(function(err, ${MODULE}) {

		if(err) {
			return res.json(ResponseUtils.responseError(err));
		}

		return res.json(ResponseUtils.responseMessage(true, 'success', ${MODULE}));
	});

};

function create(req, res, next) {

	var ${MODULE} = {
		
	};

	var ${MODULE}Doc = new ${MODULE_CAP}(${MODULE});

	${MODULE}Doc.save(function(err, doc) {
		if(err) {
			return res.json(ResponseUtils.responseError(err));
		}

		return res.json(ResponseUtils.responseMessage(true, 'success', doc._id));
	});

};

function update(req, res, next) {

	var ${MODULE}Id = req.params.id;

	var query = {
		\$set : lodash.merge({}, req.body)
	};

	${MODULE_CAP}.findByIdAndUpdate(${MODULE}Id, query, {new : true}, function(err, doc) {
		if(err) {
			return res.json(ResponseUtils.responseError(err));
		}

		return res.json(ResponseUtils.responseMessage(true, 'success', doc));
	});

};

function remove(req, res, next) {

	var ${MODULE}Id = req.params.id;

	${MODULE_CAP}.findByIdAndRemove(${MODULE}Id, function(err, doc) {
		if(err) {
			return res.json(ResponseUtils.responseError(err));
		}

		return res.json(ResponseUtils.responseMessage(true, 'success', null));
	});

};

module.exports = {
	getAll : getAll,
	getOne : getOne,
	create : create,
	update : update,
	remove : remove
};
	" > $CONTROLLER_FILE_NAME;

	echo "
var Router = require('express').Router();
var Controller = appRequire('ctrl.$MODULE');

Router.get('/', Controller.getAll);
Router.get('/:id', Controller.getOne);
Router.post('/', Controller.create);
Router.put('/:id', Controller.update);
Router.delete('/:id', Controller.remove);

module.exports = Router;
	" > $API_FILE_NAME;
}


if [ "$1" = "" ]; then
	echo "Insufficient parameters!";
	exit 1
elif [ ["$2" = ""] -a ["$1" != "help"] ]; then
	echo "Insufficient parameters!";
	exit 1
fi

if [ "$1" = "client" ]; then
	echo "Client package requested for "$2;
	create_client_module;
elif [ "$1" = "server" ]; then
	echo "Server package requested for "$2;
	create_server_module;
elif [ "$1" = "help" ]; then
	echo "USAGE : ./module.sh <client|server> <module_name>";
fi
