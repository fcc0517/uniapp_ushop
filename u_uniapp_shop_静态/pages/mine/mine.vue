<template>
	<view class="container">
		<!-- 顶部头像部分 -->
		<view class="mineTop">
			<view class="mineTop_left">
				<view class="mineTop_left_image">
					<image src="@/static/mine/timg.jpg" mode=""></image>
				</view>
				<view class="mineTop_left_info">
					<text for="" style="color: #fff;" v-if="isLogin">{{userInfo.phone}}</text>
					<button v-else type="mini" @click="_goLogin">登录/注册</button>
				</view>		
			</view>
			<view class="mineTop_right">
				<view class="mineTop_right_info">
					<text for="">每日签到</text>
				</view>
			</view>
		</view>
		
		<!-- 订单状态 -->
		<view class="order_state">
			<view class="order_state_list" @click="_goOrder">
				<image src="@/static/mine/quanbudingdan.png" mode=""></image>
				<text class="list_text">全部订单</text>
			</view>
			<view class="order_state_list">
				<image src="@/static/mine/daifukuan.png" mode=""></image>
				<text class="list_text">待付款</text>
			</view>
			<view class="order_state_list">
				<image src="@/static/mine/daishouhuo.png" mode=""></image>
				<text class="list_text">待收货</text>
			</view>
		</view>
		
		<!-- 个人信息 -->
		<view class="person_msg">
			<view class="person_msg_list">
				<view class="person_msg_list_info">
					<image src="@/static/mine/dizhiguanli.png" alt class="MsgItemLogo" />
					<text>地址管理</text>
				</view>	
				<view class="MsgItemRight">
				   <image src="@/static/mine/xiayiye.png" alt class="MsgItemDetail" />
				</view>
			</view>
			<view class="person_msg_list">
				<view class="person_msg_list_info">
					<image src="@/static/mine/zu.png" alt class="MsgItemLogo" />
					<text>我的钱包</text>
				</view>	
				<view class="MsgItemRight">
					<text class="remaB" v-show="true">200余额</text>
				   <image src="@/static/mine/xiayiye.png" alt class="MsgItemDetail" />
				</view>
			</view>
			<view class="person_msg_list">
				<view class="person_msg_list_info">
					<image src="@/static/mine/wodeyouhuiquan.png" alt class="MsgItemLogo" />
					<text>我的优惠券</text>
				</view>	
				<view class="MsgItemRight">
				   <image src="@/static/mine/xiayiye.png" alt class="MsgItemDetail" />
				</view>
			</view>
			<view class="person_msg_list">
				<view class="person_msg_list_info">
					<image src="@/static/mine/wodeerweima.png" alt class="MsgItemLogo" />
					<text>我的二维码</text>
				</view>	
				<view class="MsgItemRight">
				   <image src="@/static/mine/xiayiye.png" alt class="MsgItemDetail" />
				</view>
			</view>
			<view class="person_msg_list">
				<view class="person_msg_list_info">
					<image src="@/static/mine/xiaohuoban.png" alt class="MsgItemLogo" />
					<text>我的小伙伴</text>
				</view>	
				<view class="MsgItemRight">
				   <image src="@/static/mine/xiayiye.png" alt class="MsgItemDetail" />
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import checkToken from '../../utils/checkToken.js'
	export default {
		data(){
			return {
				userInfo:'',
				isLogin:false
			}
		},
		async onShow(){
			let result = await checkToken(this)
			console.log(result)
			this.isLogin = result
			this.userInfo = uni.getStorageSync('userInfo')
		},
		methods:{
				_goLogin(){
					uni.navigateTo({
						url:'../send/send'
					})
				},
				_goOrder(){
					uni.navigateTo({
						url:'../order/order'
					})
				}
		}
	}
</script>

<style>
	@import url("../../common/css/mine.css");
</style>
