module.exports.controllers = {
    '/test': {
        'get:doc': {
            desc: '测试',
            params: {
                param1: '第一个接口',
                param2: {
                    default: '123',
                    desc: '第二个接口'
                }
            }
        },
        get: function () {
            this.body = 'test';
        }
    }
};