// axios 自定义
import Axios from 'axios'
import { BASE_CONFIG, requestSuccess, requestError, responseSuccess, responseError } from '@/config/axios'

const axios = Axios.create({
  ...BASE_CONFIG
})

axios.interceptors.request.use(requestSuccess, requestError)
axios.interceptors.response.use(responseSuccess, responseError)

export default axios
