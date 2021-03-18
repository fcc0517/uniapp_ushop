<template>
	<view class="container">
		<!-- s收货地址 -->
		<view class="address">
			<view class="address_info">
				<label for="">收件人:{{ information.username }}</label>
				<label for="">{{ information.userphone }}</label>
			</view>
			<view class="address_res">
				收货地址：
				<label for="">{{ information.address }}</label>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="carts">
			<!-- cartsInfo 循环体 -->
			<view class="cartsInfo" v-for="(item, index) in carts">
				<!-- 70px -->
				<view class="carts_detail">
					<view class="carts_image"><image :src="item.img" mode=""></image></view>
					<view class="carts_name">
						<view for="" style="font-size: 30rpx;">{{ item.goodsname }}</view>
						<view for="" style="font-size: 26rpx; color: #C0C0C0;">规格:白色</view>
					</view>
					<view class="carts_price">
						<label for="">￥{{ item.price }}</label>
					</view>
				</view>
				<!-- 50px -->
				<view class="cart_num">
					<view class="">购买数量：</view>
					<view class="">
						<label for="" class="jian" @click="_sub(index)">-</label>
						<label for="" class="num">{{ item.num }}</label>
						<label for="" class="jia" @click="_add(index)">+</label>
					</view>
				</view>
				<!-- 横线 -->
				<view class="xian"></view>
			</view>
			<!-- 50px -->
			<view class="kuaidi">
				<label for="">配送方式</label>
				<label for="">XX快递</label>
			</view>
		</view>

		<!-- 优惠券 -->
		<view class="yhquan">
			<label for="">优惠券</label>
			<label for="" style="margin-right: 40rpx;">无可用</label>
		</view>
		<!-- jifen积分 -->
		<view class="jifen">
			<view class="use"><label for="">使用积分</label></view>
			<view class="input" style="margin-right: 40rpx;">
				<input type="text" value="" placeholder="输入积分" />
				<label for="" class="input_use">使用</label>
				<label for="" class="input_keyi">可使用50积分</label>
			</view>
		</view>

		<!-- 具体详细 -->
		<view class="resDetail">
			<view class="">
				<label for="">商品金额</label>
				<label for="" style="margin-right:40rpx;color:red">￥{{allPrice}}</label>
			</view>
			<view class="">
				<label for="">运费</label>
				<label for="" style="margin-right:40rpx;color:red">+￥0.00</label>
			</view>
			<view class="">
				<label for="">优惠券</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">会员优惠</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">积分抵扣</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
		</view>
		<!-- 实付金额 -->
		<view class="sfje">
			实付金额：
			<label for="" style="color:red">￥{{allPrice}}</label>
		</view>

		<!-- 确认订单按钮 -->
		<view class="btn">
			<!-- 点击提交订单按钮，发起支付请求 -->
			<button type="primary" @click="_addorder">提交订单</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			information: {
				username: 'YouSu',
				userphone: '15811112222',
				address: '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层'
			},
			carts: []
		};
	},
	methods: {
		async _getCartList() {
			
			let { uid = null, token = null } = uni.getStorageSync('userInfo') || {};
			// console.log(uid,token)
			let result = await this.$api.getCartInfo({ uid }, { authorization: token });
			// console.log(result)
			if(result.data.list !== null){
				this.carts = result.data.list.filter((item, index) => {
					item.img = this.$baseUrl + item.img;
					return item.checked == 1;
				});
			}
			console.log(this.carts)
		},
		// 删除购物车
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
		// 添加购物车数据
		_add(index) {
			this.carts[index].num++;
			this._editCart(index);
		},
		// 修改购物车数据
		async _editCart(index) {
			let { id, num, checked } = this.carts[index];
			checked = checked == false ? 0 : 1;
			let { token = null } = uni.getStorageSync('userInfo');
			// console.log(id, num, checked, token);
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
			// console.log(result);
			if (result.data.code != 200) {
				uni.showToast({
					title: '未登录',
					icon: 'none'
				});
				this.isLogin = false;
			}
		},
		// 添加订单
		async _addorder(){
			let {username,userphone,address} = this.information
			let {uid=null,token=null} = uni.getStorageSync('userInfo') || {}
			let countnumber = this.allNum
			let countmoney = this.allPrice
			let addtime = new Date().getTime()
			let idstr = ''
			let idarr = this.carts.map((item,index) => {
				return item.id
			})
			idstr = idarr.join(',')
			let params = {username,userphone,address,uid,token,countnumber,countmoney,addtime}
			params = JSON.stringify(params)
			let result = await this.$api.addorder({params,idstr},{authorization:token})
			console.log(result)
			if(result.data.code == 200){
				uni.navigateTo({
					url:'../order/order'
				})
			}
		}
	},
	onLoad(options) {
		// console.log(options)
		this._getCartList();
	},
	computed:{
		// 计算总价
		allPrice() {
			let totalPrice = 0;
			this.carts.forEach((item, index) => {
				if (item.checked) {
					totalPrice += item.price * item.num;
				}
			});
			return totalPrice;
		},
		// 计算数量
		allNum() {
			let totalNum = 0;
			this.carts.forEach((item, index) => {
				if (item.checked) {
					totalNum += item.num;
				}
			});
			return totalNum;
		},
	}
};
</script>

<style>
@import url('../../common/css/confirm.css');
</style>
