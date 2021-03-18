<template>
	<view class="container">
		<!-- 登录成功的状态 -->
		<view v-if="isLogin">
			<!-- 登录成功购物车有数据的情况 -->
			<view class="top" v-if="carts.length > 0">
				<scroll-view class="scroll-view_H" scroll-x="true" v-for="(item, index) in carts" :key="item.id">
					<view class="cartInfo">
						<view class="cartInfochild">
							<!-- 选择框 -->
							<view class="cartInfo_switch common">
								<!-- 点击当前商品 -->
								<switch type="checkbox" @change="_changeStatus(index, $event)" :checked="item.checked == 0 ? false : true" />
							</view>
							<!-- 图片 -->
							<view class="cartInfo_image common"><image :src="item.img" mode=""></image></view>

							<!-- 信息 -->
							<view class="cartInfo_info">
								<label for="" style="font-size: 26rpx;">{{ item.goodsname }}</label>
								<label for="" style="font-size: 24rpx; color: #ccc;">规格：白色</label>
								<label for="" style="color: red;">￥{{ item.price }}</label>
							</view>
							<!-- 加减数量 -->
							<view class="cartInfo_num">
								<view class="cartInfo_num_child">
									<label for="" @click="_sub(index)">-</label>
									<label for="">{{ item.num }}</label>
									<label for="" @click="_add(index)">+</label>
								</view>
							</view>
						</view>
					</view>
					<view class="cartDel" @click="_del(index, item.id)"><label for="">删除</label></view>
				</scroll-view>
			</view>
			<!-- 登录成功购物车没有数据的情况 -->
			<view v-else>暂无数据</view>
		</view>
		<!-- 未登录，请去登录 -->
		<view v-else>
			未登录，请去登录
			<button type="default" @click="_goSend">登录</button>
		</view>
		<!-- 底部 -->
		<view class="foot">
			<view class="footd1">
				<switch type="checkbox" :checked="_isAllChecked" @change="_changeAllStatus" />
				<label>全选</label>
			</view>
			<view class="footd2">
				<view class="footd2sp1">
					总计：
					<label style="color: red;">{{ allPrice }}</label>
				</view>
				<label class="footd2sp2">不含运费，已优惠￥0.00</label>
			</view>
			<!-- 跳到提交订单，结算页面 -->
			<view class="footd3" @click="_goConfirm">
				<!-- 被选中的商品的个数 -->
				<label>去结算({{ allNum }}件)</label>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isLogin: false,
			carts: []
		};
	},
	onLoad() {
		this._getCarts();
	},
	onShow() {
		this._getCarts();
	},
	computed: {
		// 计算总价
		allPrice() {
			let totalPrice = 0;
			this.carts.map((item, index) => {
				if (item.checked) {
					totalPrice += item.price * item.num;
				}
			});
			return totalPrice;
		},
		// 计算数量
		allNum() {
			let totalNum = 0;
			this.carts.map((item, index) => {
				if (item.checked) {
					totalNum += item.num;
				}
			});
			return totalNum;
		},
		// 全选
		_isAllChecked() {
			let status = this.carts.every((item, index) => {
				return item.checked == 1;
			});
			return status;
		}
	},
	methods: {
		async _getCarts() {
			// console.log('获取购物车')
			let { uid = null, token = null } = uni.getStorageSync('userInfo') || {};
			let result = await this.$api.getCartInfo(
				{
					uid
				},
				{
					authorization: token
				}
			);
			console.log(result);
			if (result.data.code == 200) {
				this.isLogin = true;
				this.carts = result.data.list;
				if (result.data.list == null) {
					return (this.carts = []);
				}
				// console.log(this.carts)
				// 处理图片的地址
				this.carts.map((item, index) => {
					return (item.img = this.$baseUrl + item.img);
				});
			} else {
				this.isLogin = false;
			}
		},
		_goSend() {
			uni.navigateTo({
				url: '../send/send'
			});
		},
		// 添加购物车数据
		_add(index) {
			this.carts[index].num++;
			this._editCart(index);
		},
		// 减少购物车数据
		_sub(index) {
			this.carts[index].num--;
			if (this.carts[index].num < 1) {
				uni.showToast({
					title: '至少一件',
					icon: 'none'
				});
				this.carts[index].num = 1;
			}
			this._editCart(index);
		},
		// 删除购物车数据
		_del(index, id) {
			let that = this;
			uni.showModal({
				title: '删除提示',
				content: '您确定删除么？',
				async success(res) {
					if (res.confirm) {
						let { token = null } = uni.getStorageSync('userInfo') || null;
						let result = await that.$api.cartsDel(
							{
								id
							},
							{
								authorization: token
							}
						);
						if (result.data.code == 200) {
							uni.showToast({
								title: '删除成功'
							});
							setTimeout(() => {
								that.carts.splice(index, 1);
								that._getCarts();
							}, 1500);
						}
						return;
					}
				}
			});
		},
		//单选更改每个单选的状态 input
		_changeStatus(index, e) {
			//  this._getCarts()
			this.carts[index].checked = e.detail.value;
			this._editCart(index)
		},
		// 全选
		_changeAllStatus(e) {
			this.carts.map((item, index) => {
				item.checked = e.detail.value;
				this._editCart(index)
			});
		},
		// 修改购物车数据
		async _editCart(index) {
			let { id, num, checked } = this.carts[index];
			checked = checked == false ? 0 : 1;
			let { token = null } = uni.getStorageSync('userInfo');
			console.log(id, num, checked, token);
			let result = await this.$api.cartsEdit(
				{
					id,
					num,
					checked
				},
				{
					authorization: token
				}
			);
			// console.log(checked)
			console.log(result);
			if (result.data.code != 200) {
				uni.showToast({
					title: '未登录',
					icon: 'none'
				});
				this.isLogin = false;
			}
		},
		// 跳转到结算页面
		_goConfirm() {
			let result = this.carts.findIndex((item,index) => {
				return item.checked == 1
			})
			if(result == -1){
				uni.showToast({
					title:"请选择商品",
					icon:'none'
				})
				return
			}
			uni.navigateTo({
				url:'../confirm/confirm'
			})
		}
	}
};
</script>

<style>
@import url('../../common/css/cart.css');

.cartInfo_image_img {
	width: 120rpx;
	height: 120rpx;
}

.foot {
	bottom: var(--window-bottom);
}
</style>
