<template>
	<view class="box">
		<view class="row">
			<text>手机号</text>
			<input type="text" v-model="phone" placeholder="输入手机号" maxlength="12" />
		</view>
		<view class="row">
			<view class="send">
				<text>验证码</text>
				<text @click="_sendSms">{{msg}}</text>
			</view>
			<input type="text" placeholder="- - - -" maxlength="4" v-model="code" />
		</view>
		<view class="row">
			<text style="font-size: 23rpx;">收不到验证码？试试 <text style="color:#00BB00;font-size: 23rpx;"> 语音验证</text></text>
			<!--   -->
			<button type="primary" style="width: 90%;border-radius: 80rpx;margin-top: 50rpx;"
				@click="_goLogin">登录</button>
		</view>
		<view class="row">
			<!-- <text style="color: #006699;text-align: center;" >通过微信授权登录</text> -->
		</view>
	</view>
</template>

<script>
	let app = getApp()

	export default {
		data() {
			return {
				phone: null, //手机号
				msg: '点击获取验证码', //倒计时信息
				ison: false, //false可以点击 true不可以点击
				code: null //输入框的验证码
			}

		},
		methods: {
			// 获取验证码
			async _sendSms() {
				if (this.ison) return
				this.ison = true
				// console.log('发送验证码')
				// 验证手机号
				// let regExp = /^1[3456789][0-9]{9}$/
				// if (!regExp.test(this.phone)) {
				// 	uni.showToast({
				// 		title: "手机号错误",
				// 		icon: "none"
				// 	})
				// 	return
				// }
				let result = await this.$api.getSmsInfo(this.phone)
				let phone = this.phone
				console.log(result)
				// 如果返回200，则代表登录成功
				// 开始验证码倒计时
				if (result.data.code == 200) {
					let num = 20
					let timer = setInterval(() => {
						num--
						this.msg = num + '秒后重新获取验证码'
						this.ison = true
						// 把手机号 验证码都存入缓存中
						uni.setStorageSync('code', result.data.list.code)
						uni.setStorageSync('phone', phone)
						if (num < 1) {
							num = 20
							this.msg = '点击获取验证码'
							// 重新获取可以点击
							this.ison = false
							clearInterval(timer)
							// 到时间后，清楚缓存的数据
							uni.removeStorageSync('code')
							uni.removeStorageSync('phone')
						}
					}, 1000)
				}
			},
			async _goLogin() {
				// 1 先判断输入的手机号，验证码是否跟存在缓存的内容一致
				let storCode = uni.getStorageSync('code')
				let stroPhone = uni.getStorageSync('phone')
				if (this.phone == null || stroPhone != this.phone) {
					uni.showToast({
						title: "手机号不正确",
						icon: 'none'
					})
					return this.phone = null
				}
				if (this.code == null || storCode != this.code) {
					uni.showToast({
						title: "验证码不正确",
						icon: 'none'
					})
					return this.code = null
				}
				console.log(this.phone)
				let result = await this.$api.goLogin(this.phone)
				console.log(result)
				if(result.data.code == 200){
					uni.setStorageSync("userInfo",result.data.list)
					uni.showToast({
						title:result.data.msg
					})
					setTimeout(()=>{
						uni.switchTab({
							url:'../mine/mine'
						})
					},2000)
				}
			}

		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	.box {
		position: relative;
	}

	.row {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 40rpx;
	}

	.send {
		display: flex;
		justify-content: space-between;
	}

	.send text:nth-of-type(2) {
		color: #00BB00;
	}

	text {
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}

	input {
		border-bottom: 1rpx solid gray;
		height: 65rpx;
	}
</style>
