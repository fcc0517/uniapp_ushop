<template>
	<view class="container">
		<!-- 详情图片 -->
		<view class="detailImage">
			<image :src="detailList.img">
		</view>
		<!-- 详情基本信息 -->
		<view class="detailInfo">
			<view class="detailInfoName">
				<label>{{detailList.goodsname}}</label>
			</view>
			<view class="detailInfoPrice">
				<label style="color: red;">￥ {{detailList.price}}</label>
				<label style="font-size: 24rpx;color: #ccc;">(此价格不与套装优惠同时享受)</label>
			</view>			
		</view>
		
		<!-- 基本信息改变 -->
		<view class="changeInfo">
			<view class="youhui">
				<view>促销：<label class="manjian">满减</label><label class="dazhe">满2件9折；3件8折</label></view>
			</view>
			<!-- 数量加减 -->
			<view class="changeNum">
				<view class="num">购买数量</view>
				<view class="action">
				  <label class="jian" @click="_sub">-</label>
				  <label class="zhi">{{num}}</label>
				  <label class="jia" @click="_add">+</label>
				</view>
			</view>
			<!-- 商品属性 -->
			<view class="changeState">
				<view class="productStat">
					<label for="">商品属性</label>
				</view>
				<view class="productGuige">
					<label>{{detailList.specsname}}</label>
					<view class="threed3i1" v-for="(item,index) in detailList.specsattr">{{item}}</view>
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		 <view class="productDetail">
			<view class="productDetailTitle">商品详情</view>
			<!-- 需要处理图片自适应问题 -->
			<image src="@/static/detail/2.jpg" @load="autoImage" :style="{width:autoWidth+'px',height:autoHeight+'px'}" />
		</view>
		
		<view class="productEval">
			<view class="eval">商品评价</view>
			<view >
				<label class="evalUsername">小李白</label>
				<label class="evalUsertitle">交易很好，物流很快</label>					
				<view class="evalImage">
					<image src="@/static/detail/pingjia1.jpg">
					<image src="@/static/detail/pingjia2.jpg">
					<image src="@/static/detail/pingjia3.jpg">
				</view>
				<label class="evalTime">2020-02-12</label>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="foot">
			<button class="footbtn1" @click="_goCart">加入购物车</button>
			<button class="footbtn2">立即购买</button>
		</view>
	</view>
</template>

<script>
	// 导入图片自适应工具类
	let actionimage = require('../../utils/ActionImage.js');
	export default {
		data() {
			return {
				autoHeight:'',
				autoWidth:'',
				detailList:[],
				num:1,
				curId:''
			}
		},
		methods: {
			//处理图片自适应方法
			autoImage(e){
				// 调用图片自适应工具类方法，进行处理图片
				let auto  = actionimage.default(e)
				this.autoHeight = auto.autoHeight;
				this.autoWidth = auto.autoWidth;
			},
			async _getDetailMsg(id){
				let result = await this.$api.getDetail(id)
				console.log(result.data.list[0])
				this.detailList = result.data.list[0]
				// 处理图片地址
				this.detailList.img = this.$baseUrl + this.detailList.img
				console.log(this.detailList.img)
				// 处理规格参数
				this.detailList.specsattr = this.detailList.specsattr.split(',')
				console.log(this.detailList.specsattr)
			},
			// 商品数量减少
			_sub(){
				this.num--
				if(this.num < 1){
					uni.showToast({
						title:'不能再少了',
						icon:"none"
					})
					this.num = 1
				}
			},
			// 商品数量增加
			_add(){
				this.num++
				if(this.num > this.detailList.number){
					console.log(this.detailList.number)
					uni.showToast({
						title:'不能再多了',
						icon:'none'
					})
					this.num = this.detailList.number
				}
			},
			// 加入购物车
			async _goCart(){
				let {uid=null,token=null} = uni.getStorageSync('userInfo') || {}
				let goodsid = this.curId
				let num = this.num
				let checked = 1
				let result =await this.$api.addcart({uid,goodsid,num,checked},{authorization:token})
				console.log(result)
				if(result.data.code == 200){
					uni.showToast({
						title:'添加成功',
						icon:"none"
					})
					setTimeout(() => {
						uni.switchTab({
							url:'../cart/cart'
						})
					},2000)
				}else{
					// 登录失败或者token过期
					uni.showToast({
						title:"未登录，请先登录",
						icon:'none'
					})
					setTimeout(() => {
						uni.navigateTo({
							url:'../send/send'
						})
					},2000)
				}
			}
				
		},
		onLoad: function (option) {
			console.log(option.id)
			console.log(this.detailList)
			this._getDetailMsg(option.id)
			this.curId = option.id
		}
	}
</script>

<style>
	@import url("../../common/css/details.css");
</style>
