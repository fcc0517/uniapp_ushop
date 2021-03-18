var express = require('express');
var router = express.Router();
const tableName = 'cart'
const tableNameGoods = 'goods'
const tableNameOrder = 'shop_order'
const tableNameOrders = 'orders'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const { getTree } = require("../utils");
//购物车列表
router.get("/cartlist", async (req, res) => {
    // console.log(333);res.end();
    const { uid } = req['query'];
    if (!uid) {
        res.send(MError("缺少必要条件"));
        return;
    }
    let data = await Db.select(req, `SELECT a.*,b.goodsname,b.price,b.img FROM ${tableName} a LEFT JOIN ${tableNameGoods} b ON a.goodsid = b.id WHERE a.uid = '${uid}'`);
    // console.log(data)

    res.send(Success(data));
});
//添加购物车
router.get("/cartadd", async (req, res) => {
    let { uid, goodsid, num,checked } = req['query'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE uid = '${uid}' AND goodsid = ${goodsid}`);
    console.log(info);
    let result = '';
    if (info) {
        //更新数量
        result = await Db.update(req, tableName, { num: parseInt(num) + info[0].num }, ` WHERE id = ${info[0].id}`);
    } else {
        result = await Db.insert(req, tableName, {
            uid, goodsid, num, status: 1,checked
        });
    }
    if (result) {
        res.send(Success([result], "添加成功"));
    } else {
        res.send(MError("添加失败，请查看字段信息是否正确"));
    }
});
//修改购物车
router.get("/cartedit", async (req, res) => {
    let { id, num,checked } = req['query'];
    // console.log(id,type);res.end();
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE id = ${id}`);
        let data = { num,checked };
        // data.num = type == 1 ? --data.num : ++data.num;
        const result = await Db.update(req, tableName, data, ` WHERE id = ${id}`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});
//删除购物车
router.get("/cartdelete", async (req, res) => {
    let { id } = req['query'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        if (result === true) {
            res.send(Success([], "删除成功"))
        } else {
            res.send(MError());
        }
    }
});

///添加订单
router.get("/orderadd", async (req, res) => {
    // params包含以下参数:uid  username userphone address countmoney countnumber addtime(可以不填数据库默认有值)
    // ids:购物车数据id字符串
    let { params, idstr } = req['query'];
    let orderInsertData = JSON.parse(params)//处理主订单数据
    // params = '{ "username":"小明" }'
    // {uid,username,userphone,address,countmoney,countnumber,addtime}
    //  console.log(orderInsertData,2233);
     delete orderInsertData.checked
     orderInsertData.status = 1; //新订单

    // 添加主订单数据
    result = await Db.insert(req, tableNameOrder, orderInsertData);
 
        

    // 注意result返回的就是新插入数据的id 接下来添加订单详情数据
    //根据购物车数据id获取所有的购物车数据，其实订单详情就是把购物车中的数据搬移到订单详情表中
    const cartData = await Db.select(req, `SELECT * FROM ${tableName} WHERE id IN (${idstr})`);

    // 处理购物车数据，将购物车id去掉添加主订单id

    cartData.forEach((item) => {
        delete (item.id);
        delete (item.status);
        item.orderid = result;
    })

    // 批量添加订单详情数据
    orderresult = await Db.insertAll(req, tableNameOrders, cartData);
    
    // 批量删除购物车中的数据
    const deleteresult = await Db.delete(req, `DELETE FROM ${tableName} WHERE id IN (${idstr})`);
   
    if (deleteresult) {
        res.send(Success([], "提交订单成功"));
    } else {
        res.send(MError("添加失败，请查看字段信息是否正确"));
    }
});

// 查询全部订单
router.get('/orders', async (req, res) => {
    // 获取uid
    let {uid} = req['query'];
    // 组装sql  连接订单主表  订单详情表 商品表
    let sql = `SELECT id,countmoney,countnumber,goodsname,img,status
                FROM (SELECT a.id,a.countmoney,a.countnumber,a.status,b.orderid,b.goodsid FROM ${tableNameOrder} a 
                    LEFT JOIN ${tableNameOrders} b ON a.id = b.orderid  and a.uid='${uid}' ) t1 
                inner JOIN (SELECT c.orderid,c.goodsid,g.goodsname,g.price,g.img FROM ${tableNameOrders} c 
                    LEFT JOIN ${tableNameGoods} g ON c.goodsid = g.id  ) t2 
                ON t1.orderid = t2.orderid AND t1.goodsid = t2.goodsid`;
    const orderData = await Db.select(req, sql);
    // 循环处理数据结构
    let dataInfo = {};
    orderData.forEach((item, index) => {
        let { id,countmoney,countnumber } = item;
        if (!dataInfo[id]) {
            dataInfo[id] = {
                id,	
                countmoney,
                countnumber,
                child: []
            }
        }
        dataInfo[id].child.push({goodsname:item.goodsname,img:item.img});
    });
    //console.log(dataInfo,1111122222)
    let list = Object.values(dataInfo); // list 转换成功的数据
    
    res.send(Success(list));
})

module.exports = router;

// SELECT
// 	id,countmoney,countnumber,goodsname,img,status
// FROM
// 	(
// 		SELECT
// 			shop_order.id,shop_order.countmoney,shop_order.countnumber,shop_order.status,orders.orderid,orders.goodsid
// 		FROM
// 			shop_order
// 		LEFT JOIN orders ON shop_order.id = orders.orderid
// 	) t1
// LEFT JOIN ( SELECT
// 	orders.orderid,
// 	orders.goodsid,
// 	goods.goodsname,goods.price,goods.img
// FROM
// 	orders
// LEFT JOIN goods ON orders.goodsid = goods.id
// ) t2 ON t1.orderid = t2.orderid
// AND t1.goodsid = t2.goodsid