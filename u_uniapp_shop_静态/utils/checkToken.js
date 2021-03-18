const checkToken = async (_this) => {
	let userInfo = uni.getStorageSync('userInfo') || null
	// 未登录
	if (userInfo == null) {
		uni.setTabBarItem({
			index: 2,
			text: '未登录'
		})
		return false
	}
	// console.log(_this)
	// console.log(userInfo.token)
	let result = await _this.$api.checkToken(userInfo.token)
	// console.log(result)
	if (result.data.code == 200) {
		uni.setTabBarItem({
			index: 2,
			text: '我的'
		})
		return true
	} else {
		uni.setTabBarItem({
			index: 2,
			text: "未登录"
		})

	}
	return false
}


export default checkToken
