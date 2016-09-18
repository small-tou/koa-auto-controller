/**
 *
 * 以文件夹嵌套的形式来表示route配置。

 controllers文件夹里可以放置很多controller，而且程序初始化的时候会扫描这个文件夹，对所有controller进行初始化，然后自动生成对应的url的route，这是本框架的一大特色。

 controllers里可以创建多层文件夹，每个文件夹代表route里的一级。

 例如 这样的目录结构 /controllers/user/admin.js 里面有一个 createUser: get的定义。

 则在浏览器里这样访问 www.example.com/controllers/user/admin/createUser

 同样，你可以这样来创建一个文件夹里的多个controller /controllers/user/admin/index.js
 这样的效果跟上面的完全一样，然后admin文件夹下可以继续细分其他的controller文件。

 支持正则route，写法：'reg:/(.*)' reg:指定是正则，后面跟正则路径

 controller代码的结构：
 module.exports.controllers = {
    '/list':{
        'get':function(req,res){
            var userId = commUtil.decrypt(req.query.token);
            detectionService.getAll(req.query.page||1,20,{

            },function(err,orders){
                if (err) {
                    res.send(commUtil.createParameterErrorMsg(err.message));
                } else {
                    res.send(commUtil.createNormalOK(orders));
                }
            })
        }
    }
 }
 module.exports.filters = {
    '/list':{
        get:['checkLogin']
        post:['checkLoginJson']
    }
 }

 配置方法：
 rainbow.route(app, route, {
    controllers: '/controllers/',
    filters: '/filters/',
    template: '/views/'
});
*/
var approot = process.cwd();
var glob = require('glob');
var methods = require('methods');

methods.unshift('all');
var AutoController = {
    docs: {}
};
global.AutoController = AutoController;
/**
 * 初始化 AutoController ,生成自动 Controllers 和 filters
 * @param app koa 的实例
 * @param route koa 的 route 中间件实例
 * @param paths 配置 { controllers: '/controllers/', filters: '/filters/' }
 */
exports.init = function (app, route, paths) {
    paths = paths || {};
    // app.set('views', approot+ paths.template);
    var ctrlDir = approot + (paths.controllers || '/controllers');
    var fltrDir = approot + (paths.filters || '/filters');
    // var tplDir = approot + (paths.template || '/template');

    glob.sync(ctrlDir + '/**/*.+(js|coffee)').forEach(function (file) {
        file = file.replace(/\/index\.(js|coffee)$/, '');
        var router = require(file);
        var path = file.replace(ctrlDir.replace(/\/$/, ''), '').replace(/\.(js|coffee)$/, '');
        for(var i in router.controllers) {
            if(!router.controllers.hasOwnProperty(i)) continue;
            var p;
            if(/^reg:/.test(i)) {
                p = new RegExp(path + i.replace(/^reg:/, ''));
            } else {
                p = (path + i);
                if(p !== '/') {
                    p = p.replace(/\/$/, '');
                }
            }

            var r = router.controllers[i];
            var f = router.filters ? router.filters[i] : null;
            methods.forEach(function (method) {
                var routeItem = r[method];
                if(routeItem) {
                    var filters = f ? (f[method] || []).map(function (item) {
                        return require(fltrDir + '/' + item);
                    }) : [];
                    var docObj = r[method + ':doc'];
                    if(docObj) {
                        var path = p;
                        if(p.exec) {
                            path = p.toString().replace(/^\/|\/$/g, '');
                        }
                        var docKey = method + ':' + path;

                        AutoController.docs[docKey] = r[method + ':doc'];

                        AutoController.docs[docKey].method = method;
                        AutoController.docs[docKey].api_path = path;
                    }

                    // concat方法可以接收非数组的变量, 单个或多个均可
                    // 这里不再用[]包裹router, 得以支持多个handler的数组
                    console.log(`init route : ${method.toUpperCase()} ${p}`)
                    app.use(route[method].apply(app, [p].concat(filters)
                        .concat(routeItem)));
                }
            });
        }
    });
};
