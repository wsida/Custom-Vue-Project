import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './plugins/router'
import $api from './api'
import axios from './plugins/axios'
import Antd from 'ant-design-vue'
import './styles/index.less'

// mock 接口数据模拟
import './mock'

// 使用插件
Vue.use(Antd)
Vue.config.productionTip = false

// 添加实例方法
Vue.prototype.$api = $api

Vue.prototype.$get = axios.get
Vue.prototype.$post = axios.post
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
