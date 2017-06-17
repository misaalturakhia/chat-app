
var config = {
	// Route
	'routes'				: 'routes',

	// Configurations
	'config'				: 'config/environments',
    
    // models
    'model.chat'            : 'models/chat.model',
    'model.user'            : 'models/user.model',

    // apis
    'api.chat'      : 'api/chat.api',

    // controllers
    'ctrl.chat'     : 'controllers/chat.ctrl',

    // streams
    'stream.write.chats'    : 'streams/write.chats.stream',
    'stream.text.convert'   : 'streams/text.convert.stream',
    'stream.message.analyser' : 'streams/message.analyser.stream',

	// Utils
	'utils.response'	    : 'utils/response.utils',
    'utils.multer.chat.storage' : 'utils/multer.chat.storage',
};

module.exports = config;
