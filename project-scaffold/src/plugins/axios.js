import Vue from 'vue'
import Axios from 'axios'
import { BASE_CONFIG, requestSuccess, requestError, responseSuccess, responseError } from '@/config/axios'

const axios = Axios.create({
  ...BASE_CONFIG
})

axios.interceptors.request.use(requestSuccess, requestError)
axios.interceptors.response.use(responseSuccess, responseError)

Vue.prototype.$get = axios.get
Vue.prototype.$post = axios.post
Vue.prototype.$axios = axios
