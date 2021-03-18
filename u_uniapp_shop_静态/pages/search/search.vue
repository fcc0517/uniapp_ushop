<template>
	<view>
		<uni-search-bar :radius="100" bgColor="#ffffff" class="input_" @input="_search"></uni-search-bar>
		<view class="list" v-if="true">
			<!-- row 循环体 -->
			<view class="row" v-for="(item,index) in searchResult">
				<image :src="item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>	
					<text>原价￥{{item.market_price}}</text>	
					<text>现价￥{{item.price}}</text>	
					<text>3565评论</text>	
				</view>
			</view>
		</view>
		<view class="tishi" v-else>
			没有数据亲！
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	
	
	export default {
		components: {uniSearchBar},
		data() {
			return {
				searchResult:[]
			}
		},
		methods:{
			async _search(e){
				console.log(e.value)
				let  searchImg = e.value
				let result = await this.$api.getSearchRes(searchImg)
				console.log(result)
				if(result.data.list == null){
					return this.searchResult = []
				}
				this.searchResult = result.data.list
				// 处理图片样式
				this.searchResult.map((item,index)=> {
					return item.img = this.$baseUrl + item.img
				})
				console.log(this.searchResult)
			}
		}
		
		
	}
</script>

<style>

	.row{
		position: relative;
		margin: 10rpx 20rpx;
		height: 190rpx;
		border-bottom: 1rpx solid #AAAAAA;
	}
	image{
		position: absolute;
		top: 0;
		left:10rpx;
		width: 160rpx;
	}
	.info{
		height: 85%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 200rpx;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		font-size: 25rpx;
	}
	.info text:nth-of-type(2){
		color: red;
	}
	.info text:nth-of-type(3){
		font-size: 20rpx;
		color: #AAAAAA;
	}
	.tishi{
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}
</style>
