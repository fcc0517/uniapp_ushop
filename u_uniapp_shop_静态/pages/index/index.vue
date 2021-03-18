<template>
	<view class="">
		<!-- 顶部信息 -->
		<view class="HomeTop">
			<view class="logoView">
				<!-- logo -->
				<img class="logo" src="/static/index/logo.jpg" alt="" />
			</view>
			<view class="inputView">
				<input class="textinput" style="text-align: center;" type="text" value="" placeholder="寻找商品"
					@click="_goSearch" />
			</view>
		</view>

		<!-- 顶部导航  scroll-view -->

		<view class="tabs">
			<scroll-view id="tab-bar" class="scroll-h" scroll-x="{true}">
				<view class="uni-tab-item" @click="_checkCate(0)">
					<text class="uni-tab-item-title "
						:class="currentIndex== 0? 'uni-tab-item-title-active' : '' ">推荐</text>
				</view>
				<view class="uni-tab-item" v-for="(item,index) in cateList" @click="_checkCate(index+1,item.id)"
					:key="item.id">
					<text class="uni-tab-item-title"
						:class="currentIndex==index+1? 'uni-tab-item-title-active' : '' ">{{item.catename}}</text>
				</view>
			</scroll-view>
		</view>
		<!-- 推荐轮播图 -->
		<view class="banner-container">
			<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000">
				<swiper-item v-for="(item,index) in BannerList">
					<view class="swiper-item">
						<image :src="item.img" mode=""></image>
					</view>
				</swiper-item>

			</swiper>
		</view>

		<!-- 功能导航开始 -->
		<!-- 功能导航 -->
		<view class="FunctNavCon">
			<view class="FunctNavLi">
				<image src="@/static/index/xiaohuoban.png" alt class="FunImg" />
				<p>限时抢购</p>
			</view>
			<view class="FunctNavLi">
				<image src="@/static/index/jifentixicopy.png" alt class="FunImg" />
				<p>积分商城</p>
			</view>
			<view class="FunctNavLi">
				<image src="@/static/index/lianxiwomen.png" alt class="FunImg" />
				<p>联系我们</p>
			</view>
			<view class="FunctNavLi" @click="_goClassify">
				<image src="@/static/index/-shangpinfenlei-gai.png" alt class="FunImg" />
				<p>商品分类</p>
			</view>
		</view>

		<!-- 推荐部分 未写 -->
		<view class="HotGoods">
			<!-- 热推左侧 -->
			<view class="HotLeft">
				<view class="LimitedContent">
					<image class="LimitedImg" src="@/static/index/xianshi.jpg" alt />
					<label class="Limited">限时秒杀</label>
				</view>
				<p class="LimitedTitle">每天零点场，好货秒不停</p>
				<!-- 倒计时 -->
				<view class="LimitTimeAll">
					<label class="LimitTime">{{time.h}}</label>
					<view class="maohao">:</view>
					<label class="LimitTime">{{time.m}}</label>
					<view class="maohao">:</view>
					<label class="LimitTime">{{time.s}}</label>
					<label class="Seckill">秒杀</label>
				</view>
				<image src="@/static/index/goods.jpg" class="LimitedgoodsImg" alt="">
			</view>

			<!-- 热推右侧 -->
			<view class="HotRight">
				<!-- 右侧顶部部分 -->
				<view class="HotTop">
					<view class="HomeTopInfo">
						<view class="HomeTopInfoOne">
							<label class="BrandNew">品牌上新</label>
							<label class="Discount">折</label>
						</view>
						<view class="HomeTopRobbig">
							<label>每日九点，抢大牌</label>
						</view>
					</view>
					<!-- <div> -->
					<view class="Cloth">
						<image src="@/static/index/goods1.jpg" alt="">
					</view>

					<!-- </div> -->
				</view>
				<!-- 右侧底部 -->
				<view class="HotBottom">
					<view class="HotBottomLeft">
						<view class="HotBottomLeftInfo">
							<label class="HotBottomLeftInfoTitle">每日十件</label>
							<label class="HotBottomLeftInfoDetail">只为你选好货</label>
						</view>
						<view class="HotBottomLeftImage">
							<image src="@/static/index/goods1.jpg" mode=""></image>
						</view>
					</view>
					<view class="HotBottomRight">
						<view class="HotBottomRightInfo">
							<label class="HotBottomRightInfoTitle">每日十件</label>
							<label class="HotBottomRightInfoDetail">只为你选好货</label>
						</view>
						<view class="HotBottomRightImage">
							<image src="@/static/index/goods1.jpg" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 轮播图2 -->
		<div class="Swiper2">
			<image class="Swiper2Img" src="@/static/index/swiper.jpg" alt />
		</div>

		<!-- 底部商品列表 -->
		<view class="products">
			<!-- 商品标签 -->
			<view class="tags">
				<view class="tag_list " :class="bottomIndex==0?'active_tag_list' :'' " @click="_changeBottom(0)">
					<label for="">热门推荐</label>
				</view>
				<view class="tag_list" :class="bottomIndex==1?'active_tag_list' :'' " @click="_changeBottom(1)">
					<label for="">最新好货</label>
				</view>
				<view class="tag_list" :class="bottomIndex==2?'active_tag_list' :'' " @click="_changeBottom(2)">
					<label for="">所有商品</label>
				</view>
			</view>
			<!-- 标签对应的商品 -->
			<view class="tags_product">
				<view class="product" v-for="(item,index) in bottomList" @click="_goDetail(item.id)">
					<view class="GoodsLeft">
						<image class="GoodsImg" :src="item.img" />
					</view>
					<view class="GoodsCont">
						<view class="GoodConTit">{{item.goodsname}}</view>
						<view class="GoodsPrice">￥{{item.price}}</view>
						<view class="yimai">原价:{{item.market_price}}</view>
						<view class="Immed">立即抢购</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cateList: [], //一级分类的数组
				currentIndex: 0, // 一级分类下标
				BannerList: [], //轮播图的数据
				timer: null,
				time: {},
				bottomList: [],
				bottomIndex: 0
			}
		},
		onLoad() {
			this._getCateList()
			this._getBannerList()
			this._getSpeckill()
			this._getIndexGoods(this.bottomIndex)
		},
		methods: {
			// 获取首页一级菜单
			async _getCateList() {
				let result = await this.$api.getCate();
				console.log(result)
				this.cateList = result.data.list
				// console.log(this.cateList)
			},
			// 选项卡切换
			_checkCate(index, fid) {
				console.log(fid)
				this.currentIndex = index
				// 推荐页面无法跳转
				if (index == 0) {
					return
				}
				uni.navigateTo({
					url: '../product/product?fid=' + fid
				})
			},
			// 获取轮播图的数据
			async _getBannerList() {
				let result = await this.$api.getBanner()
				console.log(result)
				this.BannerList = result.data.list
				this.BannerList.map((item, index) => {
					return item.img = this.$baseUrl + item.img
				})
				// console.log(this.BannerList)
			},
			// 获取秒杀的数据
			async _getSpeckill() {
				let result = await this.$api.getSkill()
				console.log(result)
				// 结束时间-当前的时间
				this._actionTime(result.data.list[0].endtime)
			},
			_actionTime(endTime) {
				console.log(endTime)
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					let t = parseInt((endTime - new Date().getTime()) / 1000) //天数
					let h = parseInt(t / 3600)
					let m = parseInt((t % 3600) / 60)
					let s = parseInt(t % 60)

					h = h < 10 ? "0" + h : "" + h
					m = m < 10 ? "0" + m : "" + m
					s = s < 10 ? "0" + s : "" + s
					this.time = {
						h,
						m,
						s
					}
					// console.log(this.time )
				}, 1000)
			},
			// 底部选项卡
			_changeBottom(index) {
				// console.log(index)
				this.bottomIndex = index
				this._getIndexGoods(index)
			},
			// 请求首页导航数据
			async _getIndexGoods(index) {
				console.log(index)
				let res = await this.$api.getIndexGoods();
				console.log(res)
				console.log(res.data.list[index])
				this.bottomList = res.data.list[index].content
				console.log(this.bottomList)
				this.bottomList.map((item, index) => {
					return item.img = this.$baseUrl + item.img
				})
			},
			// 跳转搜索页面
			_goSearch() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			// 跳转商品分类页面
			_goClassify() {
				uni.navigateTo({
					url: '../classify/classify'
				})
			},
			// 跳转商品详情
			_goDetail(id) {
				console.log(id)
				uni.navigateTo({
					url: '../details/details?id=' + id
				})
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/index.css");
</style>
