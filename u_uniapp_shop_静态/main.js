//导入vue组件
import Vue from 'vue'

// 导入根组件app
import App from './App'

// 取消生产提示
Vue.config.productionTip = false

//指定根组件类型
App.mpType = 'app'
import api from "./utils/api.js"
Vue.prototype.$api = api
import baseUrl from './utils/baseUrl.js'
Vue.prototype.$baseUrl = baseUrl

// 实例化vue组件
const app = new Vue({
    ...App
})
// 进行挂载
app.$mount()
