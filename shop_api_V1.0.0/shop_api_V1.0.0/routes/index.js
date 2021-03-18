//前台不登录就可以访问的接口
var express = require('express');
const formidable = require('formidable'); //处理含有文件上传的表单
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const random = require('string-random');
const { Success, MError,Guest } = require("../utils/Result");// 封装统一接口返回方法
const Db = require("../utils/Db");
const { getUUID,getToken } = require("../utils");
const {checkToken,getuid} = require("../utils"); // 登录拦截中间件
const WXBizDataCrypt = require('../utils/Node/WXBizDataCrypt') //引入解密文件
var app = express();

// 引入发送短信模块（使用阿里云的短信）
const Core = require('@alicloud/pop-core');
const cookiesession = require('cookie-session');

var router = express.Router();
const tableNameCate = 'category';//商品分类
const tableNameBanner = 'banner';//轮播图
const tableNameGoods = 'goods';//商品
const tableNameSpecs = 'specs';//规格表
const tableNameMember = 'member';//会员表
const tableNameSeck = 'seckill';//限时秒杀表
   //javascript  树形结构
   function toTree(data) {
    // 删除 所有 children,以防止多次调用
    data.forEach(function(item) {
        delete item.children;
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function(item) {
        // 在该方法中可以给每个元素增加其他属性
        // item.text = item.name;
        if(item.pid == 0){
            // console.log(item.pid)
            map[item.id] = item;
        }  
    });
    // console.log(map);
    var val = [];
    data.forEach(function(item) {
        // 以当前遍历项的pid,去map对象中找到索引的id
            var parent = map[item.pid];
            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
            if (parent) {
                //  添加到父节点的子节点属性中
                (parent.children || (parent.children = [])).push(item);
            } else {
                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                val.push(item);
            }
    });

    return val;
}

// 商品搜索
router.get('/search',async(req,res)=>{
    const {keywords} = req['query'];
    if(!keywords){
        res.send(MError("缺少必要条件"));
        return;
    }
    let data = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE goodsname like '%${keywords}%' `);
    res.send(Success(data));
})


//获取分类信息
router.get("/getcate", async (req, res) => {
    let data = await Db.select(req, `SELECT * FROM ${tableNameCate} WHERE pid = 0 AND status = 1`);
    res.send(Success(data));
});

// 获取所有商品分类数据 返回分类树（递归）
router.get("/getcates", async (req, res) => {
    let data = await Db.select(req, `SELECT * FROM ${tableNameCate} WHERE status = 1`);
    // const data = await Db.select(req, `SELECT a.*,b.id,b.goodsname,b.img FROM ${tableNameCate} a LEFT JOIN ${tableNameGoods} b ON a.id = b.second_cateid WHERE a.status = 1`);
    // console.log(data)
    // 将数据排序 父与子关系
    data = toTree(data)
    // console.log(data)
    res.send(Success(data));
});

//获取轮播图信息
router.get("/getbanner", async (req, res) => {
    let data = await Db.select(req, `SELECT * FROM ${tableNameBanner} WHERE status = 1`);
    // console.log(data)
    res.send(Success(data));
});
//获取限时秒杀
router.get("/getseckill",async(req,res)=>{
    // 当天0点
    var start = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(); 
    // 当天23:59
    var end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000).getTime();
    let sql = `SELECT a.*,b.img,b.price FROM ${tableNameSeck} a LEFT JOIN ${tableNameGoods} b ON a.goodsid = b.id WHERE begintime >= ${start} AND endtime <= ${end}`;
    console.log(sql)
    let data = await Db.select(req,`SELECT a.*,b.img,b.price FROM ${tableNameSeck} a LEFT JOIN ${tableNameGoods} b ON a.goodsid = b.id WHERE begintime >= ${start} AND endtime <= ${end}`);
    res.send(Success(data));
})
//获取首页商品-推荐、最新上架、所有商品
router.get("/getindexgoods",async(req,res)=>{
	let data1 = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 AND ishot = 1 LIMIT 10`);
	let data2 = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 AND isnew = 1 LIMIT 10`);
	let data3 = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 LIMIT 10`);
	let data = [];
	data.push({content:data1});
	data.push({content:data2});
	data.push({content:data3});
	res.send(Success(data));
});

//获取一级分类下商品
router.get("/getcategoods",async(req,res)=>{
    const {fid} = req['query'];
    if(!fid){
        res.send(MError("缺少必要条件"));
        return;
    }
    let data = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 AND first_cateid = ${fid}`);
    res.send(Success(data));
});

//获取二级分类下商品
router.get("/getcate2goods",async(req,res)=>{
    const {fid} = req['query'];
    if(!fid){
        res.send(MError("缺少必要条件"));
        return;
    }
    let data = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 AND second_cateid = ${fid}`);
    res.send(Success(data));
});

//获取一级分类下商品 分页版本
router.get("/getcategoodPage", async (req, res) => {
    const { size,page,fid } = req['query'];
    if(!fid){
        res.send(MError("缺少必要条件"));
        return;
    }
    let sql = `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 AND first_cateid = ${fid}`
    if(size && page){
        let pagesize = (page-1)*size;//设置偏移量
    	sql += ` LIMIT ${pagesize},${size} `;
    }
    // console.log(sql)
    let gooddata = await Db.select(req,sql);
    // 获取总页数
    let countSql = `SELECT count(id) as count FROM ${tableNameGoods} WHERE status = 1 AND first_cateid = ${fid}`;
    let countNum = await Db.select(req,countSql);
    let totalPage = Math.ceil(countNum[0].count / size);
    console.log(totalPage);
    // 组装商品数据和总页码
    let data = [totalPage,gooddata]
    res.send(Success(data));
});

//获取二级分类下商品 分页版本
router.get("/getcate2goodPage", async (req, res) => {
    const { size,page,fid } = req['query'];
    if(!fid){
        res.send(MError("缺少必要条件"));
        return;
    }
    let sql = `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 AND second_cateid = ${fid}`
    if(size && page){
        let pagesize = (page-1)*size;//设置偏移量
    	sql += ` LIMIT ${pagesize},${size} `;
    }
    // console.log(sql)
    let gooddata = await Db.select(req,sql);
    // 获取总页数
    let countSql = `SELECT count(id) as count FROM ${tableNameGoods} WHERE status = 1 AND second_cateid = ${fid}`;
    let countNum = await Db.select(req,countSql);
    let totalPage = Math.ceil(countNum[0].count / size);
    console.log(totalPage);
    // 组装商品数据和总页码
    let data = [totalPage,gooddata]
    res.send(Success(data));
});


//获取一条商品信息
router.get("/getgoodsinfo", async (req, res) => {
    const {id} = req['query'];
    if (!id) {
        res.send(MError("缺少必要条件"));
        return;
    }
    const info = await Db.select(req, `SELECT a.*,b.specsname FROM ${tableNameGoods} a LEFT JOIN ${tableNameSpecs} b ON a.specsid = b.id WHERE a.id = '${id}'`);
    res.send(Success(info, '获取成功'));
});
//注册
router.post("/register", async (req, res) => {
    let { phone,nickname,password } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableNameMember} WHERE phone = '${phone}'`);
    if (info) {
        res.send(MError("手机号已存在，不能重复！"));
    } else {
        const randstr = random(5);
        password += randstr;
        password = crypto.createHash('md5').update(password).digest("hex");
        const result = await Db.insert(req, tableNameMember, {
            uid: getUUID(),
            phone,
            nickname,
            password,
            randstr,
            addtime:new Date().getTime(),
            status:1//新注册
        });
        if (result) {
            res.send(Success([], "注册成功"));
        } else {
            res.send(MError("注册失败"));
        }
    }
});

//登录
router.post("/login", async (req, res) => {
    let { phone,password } = req['body'];
    if(!phone || !password){
        res.send(MError("请填写手机号和密码"));
        return;
    }
    const result = await Db.select(req, `SELECT * FROM ${tableNameMember} WHERE  phone = '${phone}'`)
    if(result === null){
        res.send(MError("用户信息不存在"));
        return;
    }
    const info = result[0];
    password += info.randstr;
    password = crypto.createHash('md5').update(password).digest("hex");
    if(password !== info.password){
        res.send(MError("用户名密码错误"));
        return;
    }
    // 当用户登录时，直接获取登录时的token返给前端 ，有效时间为60秒
    let token = getToken(info['uid']);
    let data = {
    	token,uid:info.uid,phone:info.phone,nickname:info.nickname
    }
    res.send(Success(data, '登录成功'));
});


// ==========================================================小程序的登录接口=============================================================
/*
    小程序登录接口，   let  token = getToken(info['uid']);登录成功之后，也得需要token，前台获取购物车信息需要token
*/
// 使用阿里云发送手机验证码短信
// 使用阿里云发送手机验证码短信
// var request = require('request');
// var querystring = require('querystring');
router.get('/sms',(req,res)=>{
    // 获取手机号
    const {phone} = req['query'];
        // 生成手机随机验证码
    function rand(min,max) {
        return Math.floor(Math.random()*(max-min))+min;
    }
    var code = rand(1000,9999);
    // =====================聚合数据api开始============================
    // res.send(Success({'code':code}, '获取成功'));
    // var queryData = querystring.stringify({
    //     "mobile": phone,  // 接受短信的用户手机号码
    //     "tpl_id": "84603",  // 您申请的短信模板ID，根据实际情况修改
    //     "tpl_value": "#code#="+code,  // 您设置的模板变量，根据实际情况修改
    //     "key": "d16432f617c3693855da1d53bdefad91",  // 应用APPKEY(应用详细页查询)
    // });

    // var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;

    // request(queryUrl, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         console.log(body) // 打印接口返回内容
            
    //         var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
    //         // console.log(jsonObj)
    //         res.send(Success({'code':code,jsonObj}, '获取成功'));
    //     } else {
    //         // console.log('请求异常');
    //         res.send(MError("发送失败"));
    //     }
    // }) 
    // ======================聚合数据api结束=============================

    // 注意accessKeyId和accessKeySecret需要在阿里云用户中心获取
    // var client = new Core({
    //   accessKeyId: 'LTAIAZOhmLV1oBTa',
    //   accessKeySecret: 'XRHb4FJD3h1gYgCkhtuXUqr4SXyo5M',
    //   endpoint: 'https://dysmsapi.aliyuncs.com',
    //   apiVersion: '2017-05-25'
    // });
    // // 将验证码存储到session中供后期验证比对 有效期是60s
    // // req.session.code=code;  (存在服务端)
    // var params = {
    //   "RegionId": "cn-hangzhou",
    //   "PhoneNumbers": phone,
    //   "SignName": "蘑菇街商城学习",
    //   "TemplateCode": "SMS_171116888",
    //   "TemplateParam": JSON.stringify({code})
    // }
    // var requestOption = {
    //   method: 'POST'
    // };
    // client.request('SendSms', params, requestOption).then((result) => {
    //   res.send(Success({'code':code,"info":JSON.stringify(result)}, '获取成功'));
    // }, (ex) => {
    //     res.send(MError("发送失败"));
    // })
    res.send(Success({'code':code}, '获取成功'));
    
})
// 微信小程序登录手机验证码方式
router.get('/wxlogin',async(req,res)=>{
    //获取前台传递的手机号和手机验证码
    const{phone} = req['query'];   //也应该获取code
    // 判断参数是否为空
    if(phone == ''){
        res.send(MError('请填写信息'))
    }
    // console.log(phone);res.end();
    // return;
    // console.log( req.session.code);
    // 获取当前手机号的验证码
    // let code_sessiossssn = req.session.code || '请先获取验证码';
    // if(!code_session == '请先获取验证码'){//如果失效
    //     res.send(MError(code_session));
    // }else if(code == code_session){//验证码不正确
    //     res.send(MError('验证码错误'));
    // }else{//验证码验证通过
        // 继续处理判断该用户手机号之前是否登录（既注册过，登录即注册）过，登录过就返回对应的uid和token，没有就新建一条数据并返回相关数据（uid、、、）
        // 根据手机号查询记录
        
        const result = await Db.select(req, `SELECT * FROM ${tableNameMember} WHERE phone = '${phone}'`);
        // res.send( '2222' )
        // console.log( result,1111111 )
        // let info = result[0];
        
        
        //return;
        if(result){
            let info = result[0];
            let token = getToken(info['uid']);//获取token
            let data = {//组装返回数据   微信登录的用户没有昵称注意也可以随机生成一个
                token,uid:info.uid,phone:info.phone
            }
            console.log(info);
            res.send(Success(data, '登录成功'));
        }else{
            //该用户第一次登录就注册用户数据到数据库中
            let uid = getUUID();//随机获取uid
            let token = getToken(uid);//获取token
            const result = await Db.insert(req, tableNameMember, {
                uid,
                phone,
				nickname:null,
				password:null,
				randstr:null,
                addtime:new Date().getTime(),
                status:1//新注册
            });
            if (result) {
                let data={token,uid,phone:phone};
                res.send(Success(data, "新注册登录成功"));
            } else {
                res.send(MError("登录失败"));
            }
        // }
    }

})
// token校验测试接口  注意测试路由需要在config\global.js文件中配置路径
router.get('/checktoken',async(req,res)=>{
    if (!req.headers.authorization) {
        console.log(111)
        res.send(MError([], "请设置请求头,并携带验证字符串"));
    }else if (!await checkToken(req)) { // 过期  
        console.log(222)
        res.send(Guest([], "登录已过期或访问权限受限"));
    } else {
        console.log('没有过期')
        res.send(Success({'code':200}, 'ok'));
    }
})


//解密获取用户的手机号  因为个人开发者是不允许获取手机此功能待开发后续,实例代码可以参考ndo文件夹下demo.js......
router.get('/jiemi',async(req,res)=>{
    // 获取基本参数  adcf63ce1fa46774eecab6c429ebf70e
    // let {encryptedData,iv} = req['query'];
        
    // var appId = ''
    // var sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
    
})


module.exports = router;