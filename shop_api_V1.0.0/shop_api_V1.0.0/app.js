var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// const cookiesession = require('cookie-session');
var session = require('express-session');
var logger = require('morgan');
const dbObj = require("./utils/Db"); // 数据库对象
const {Guest,MError} = require("./utils/Result"); // 封装统一接口返回方法
const {checkToken,getuid} = require("./utils"); // 登录拦截中间件
const { validator } = require("./validator"); // 参数合法性校验
var app = express();

// 解决跨域问题   npm  install  cors
let cors = require('cors')  //引入
app.use(cors()) // 使用


//使用session中间件
// app.use(cookiesession({
//     name: 'session',
//     keys: ['#eere11s'],
//     maxAge:5*60*1000
// }));
app.use(session({
    name: 'session-name', // 这里是cookie的name，默认是connect.sid
    secret: 'my_session_secret', // 建议使用 128 个字符的随机字符串
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000, httpOnly: true }
}));

app.use(dbObj.connection); // 使用单例模式建立数据库连接， 给express应用对象添加中间件功能
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use((req, res, next) => { // 负责挂载uid到req对象身上
    getuid(req);
    next();
});
app.use((req, res, next) => { // 负责验证参数合法性
    validator(req) ? next() : res.send(MError());
})
var loginRouter = require('./routes/login');
var indexRouter = require('./routes/index');
app.use('/api', loginRouter);//前台、后台用户登录
app.use('/api', indexRouter);//前台数据获取

app.use(express.static(path.join(__dirname, 'public')));



// 如果想被登录拦截器拦截判断的, 接口放到下面(此拦截器一下所有的路由都需要验证本次请求是否携带token以及token有效期)
app.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        res.send(MError([], "请设置请求头,并携带验证字符串"));
    } else {
        if (!await checkToken(req)) { // 过期  
            res.send(Guest([], "登录已过期或访问权限受限"));
        } else {
            next();
        }
    }
});



//后台管理相关接口
var menuRouter = require('./routes/menu');
var roleRouter = require('./routes/role');
var userRouter = require('./routes/user');
var categoryRouter = require('./routes/category');
var specsRouter = require('./routes/specs');
var goodsRouter = require('./routes/goods');
var bannerRouter = require('./routes/banner');
var seckRouter = require('./routes/seck');
var memberRouter = require('./routes/member');

//前台购物车、订单接口
var cartRouter = require('./routes/cart');
app.use('/api', cartRouter);

app.use('/api', menuRouter);
app.use('/api', roleRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', specsRouter);
app.use('/api', goodsRouter);
app.use('/api', bannerRouter);
app.use('/api', seckRouter);

app.use('/api', memberRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;