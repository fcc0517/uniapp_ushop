<template>
	<view class="box">
		<!-- logo -->
		<img class="logo" mode="widthFix" src="@/static/index/logo.jpg" alt="" />
		<view class="login" hover-class="change">
			<!-- 注意个人开发者不允许获取用户的手机号 -->
			<button type="default" style="background-color: orangered;color: white;width: 100%;" >微信用户一键登录</button>
			<text >手机号验证注册/登录</text>
		</view>
		<view class="foot">
			<text>我已阅读并同意
				<text class="bikan"> 服务协议 </text>及
				<text class="bikan"> 隐私政策 </text>
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
		
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	.box {
		position: relative;
	}

	.logo {
		width: 240rpx;
		position: absolute;
		left: 0;
		right: 0;
		margin: 200rpx auto;
	}

	.login {
		position: absolute;
		margin: 40rpx;
		top: 350rpx;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		/* 		border: 1rpx solid red; */

	}

	.login text {
		color: #006699;
		font-size: 25rpx;
		margin-top: 30rpx;
	}

	.foot {
		position: fixed;
		bottom: 50rpx;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 25rpx;
	}

	.bikan {
		color: #006699;
	}
</style>
