# koa-auto-controller
auto generate controller by folder struct for koa

### 说明

 以文件夹嵌套的形式来表示route配置。

 controllers文件夹里可以放置很多controller，而且程序初始化的时候会扫描这个文件夹，对所有controller进行初始化，然后自动生成对应的url的route，这是本框架的一大特色。

 controllers里可以创建多层文件夹，每个文件夹代表route里的一级。

 例如 这样的目录结构 /controllers/user/admin.js 里面有一个 createUser: get的定义。

 则在浏览器里这样访问 www.example.com/controllers/user/admin/createUser

 同样，你可以这样来创建一个文件夹里的多个controller /controllers/user/admin/index.js
 这样的效果跟上面的完全一样，然后admin文件夹下可以继续细分其他的controller文件。

 支持正则route，写法：'reg:/(.*)' reg:指定是正则，后面跟正则路径

### controller代码的结构：
````
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
````
### 配置方法：
````
rainbow.route(app, route, {
    controllers: '/controllers/',
    filters: '/filters/',
    template: '/views/'
});
````