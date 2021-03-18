import http from "./http.js"
// 请求一级分类数据
const getCate = () => {
	let options = {
		url: "/api/getcate"
	}
	return http(options)
}
// 请求轮播图数据
const getBanner = () => {
	let options = {
		url: "/api/getbanner"
	}
	return http(options)
}
// 获取显示秒杀的数据
const getSkill = () => {
	let options = {
		url: "/api/getseckill"
	}
	return http(options)
}
// 获取底部导航栏数据
const getIndexGoods = () => {
	let options = {
		url: "/api/getindexgoods"
	}
	return http(options)
}
// 搜索页面获取数据
const getSearchRes = (value) => {
	let options = {
		url: "/api/search",
		data: {
			keywords: value
		}
	}
	return http(options)
}
// 6.分类页面获取所有的分类数据
const getAllCates = () => {
	let options = {
		url: "/api/getcates"
	}
	return http(options)
}
// 获取一级分类所有的数据
const getProducs = (fid) => {
	let options = {
		url: "/api/getcategoods",
		data: {
			fid
		}
	}
	return http(options)
}
// 获取商品详情
const getDetail = (id) => {
	let options = {
		url: "/api/getgoodsinfo",
		data: {
			id
		}
	}
	return http(options)
}
// 获取手机号验证码
const getSmsInfo = (phone) => {
	let options = {
		url: "/api/sms",
		data: {
			phone
		}
	}
	return http(options)
}

// 去登录
const goLogin = (phone) => {
	let options = {
		url: "/api/wxlogin",
		data: {
			phone
		}
	}
	return http(options)
}

// 检查token是过期
const checkToken = (authorization) => {
	let options = {
		url: "/api/checktoken",
		header: {
			authorization
		}
	}
	return http(options)
}
// 添加购物车
const addcart = (data, header) => {
	let options = {
		url: "/api/cartadd",
		data,
		header
	}
	return http(options)
}
// 获取购物车信息
const getCartInfo = (data, header) => {
	let options = {
		url: "/api/cartlist",
		data,
		header
	}
	return http(options)
}

// 购物车数据修改
const cartsEdit = (data, header) => {
	let options = {
		url: "/api/cartedit",
		// data:{
		// 	id,num,checked
		// },
		// header:{
		// 	authorization
		// }
		data,
		header
	}
	return http(options)
}
// 删除购物车的数据
const cartsDel = (data, header) => {
	let options = {
		url: "/api/cartdelete",
		// data:{
		// 	id,num,checked
		// },
		// header:{
		// 	authorization
		// }
		data,
		header
	}
	return http(options)
}
// 添加订单
const addorder = (data, header) => {
	let options = {
		url: "/api/orderadd",
		
		data,
		header
	}
	return http(options)
}
//查询订单
const getOrderInfo = (data, header) => {
	let options = {
		url: "/api/orders",
		data,
		header
	}
	return http(options)
}
export default {
	getCate,
	getBanner,
	getSkill,
	getIndexGoods,
	getSearchRes,
	getAllCates,
	getProducs,
	getDetail,
	getSmsInfo,
	goLogin,
	checkToken,
	addcart,
	getCartInfo,
	cartsEdit,
	cartsDel,
	addorder,
	getOrderInfo
}
