<template>
	<view class="container">
		<!-- left左侧列表 -->
		<view class="left">
			<!-- 循环遍历的 -->
			<!--  -->
			<view class="left_list" :class="currendIndex==index ? 'activeList' : ''"
				v-for="(item,index) in classIfyList" @click="_changeActive(index)">
				<label for="">{{item.catename}}</label>
			</view>
		</view>
		<!-- right右侧详细分类商品 -->
		<view class="right">
			<!-- 每一个小类 -->
			<view class="right_list">
				<!-- 商品 -->
				<view class="bottom">
					<block v-if="this.classIfyList.length > 0">
						<view class="bottom_list" v-for="(item,index) in classIfyList[currendIndex].children">
							<view>
								<image :src="item.img" alt="">
									<span>{{item.catename}}</span>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classIfyList: [],
				currendIndex: 0
			}
		},
		onLoad() {
			this._getAllCates()

		},
		methods: {
			// 获取所有的分类数据
			async _getAllCates() {
				let result = await this.$api.getAllCates()
				this.classIfyList = result.data.list
				console.log(this.classIfyList)
				// 如果有下级菜单，需要修改图片的格式
				this.classIfyList.map((item, index) => {
					if (item.children) {
						item.children.map((item1, index1) => {
							return item1.img = this.$baseUrl + item1.img
						})
					}
				})

			},
			// 左边导航栏下标
			_changeActive(index) {
				// console.log(index)
				this.currendIndex = index
			},
			// 获取所有的二级分类

		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/classify.css");

	/* 点击左侧导航，显示动态样式 */
	.activeList {
		border-left: 6rpx solid #f26b11;
		color: #f26b11;
	}

	.bottom {
		text-align: center;
		display: flex;
		flex-direction: row;
	}
</style>
