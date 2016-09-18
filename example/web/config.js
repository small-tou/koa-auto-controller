var isDevStatus = function() {
    //export production=true;node app.js;
    if(process.env.production === 'true') {
        return false;
    }
    return true;
};

var env = isDevStatus() ? 'dev' : 'prod';
var config = {
    'dev': {
        base_path: __dirname
    }
};

module.exports = config[env];