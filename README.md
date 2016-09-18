# koa-auto-controller
auto generate controller by folder struct for koa

### 说明

 以文件夹嵌套的形式来表示 route 配置。

 controllers 文件夹里可以放置很多 controller，而且程序初始化的时候会扫描这个文件夹，对所有 controller 进行初始化，然后自动生成对应的 url 的 route，这是本框架的一大特色。

 controllers 里可以创建多层文件夹，每个文件夹代表 route 里的一级。

 例如 这样的目录结构 /controllers/user/admin.js 里面有一个 createUser: get 的定义。

 则在浏览器里这样访问 www.example.com/controllers/user/admin/createUser

 同样，你可以这样来创建一个文件夹里的多个 controller /controllers/user/admin/index.js
 这样的效果跟上面的完全一样，然后 admin 文件夹下可以继续细分其他的 controller 文件。

 支持正则 route，写法：'reg:/(.*)' reg:指定是正则，后面跟正则路径

### controller 代码的结构：
````
 module.exports.controllers = {
    '/list':{
        'get': function() {

        }
    }
 };
 module.exports.filters = {
    '/list': {
        get: ['checkLogin']
        post: ['checkLoginJson']
    }
 };
````
### 配置方法：
````
const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const autoController = require('koa-auto-controller');

// init auto controller
autoController.init(app, route, {
    controllers: '/controllers/',
    filters: '/filters/'
});

app.listen(8002);
````