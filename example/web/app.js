const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const autoController = require('../../lib/auto-controller.js');

// init auto controller
autoController.init(app, route, {
    controllers: '/controllers/',
    filters: '/filters/'
});
// get the doc struct
console.log(AutoController.docs)

app.listen(8002);