/**
 * axios 拦截器配置
 */
import Vue from 'vue'
// 基础配置
export const BASE_CONFIG = {
  // baseURL: process.enc.VUE_APP_BASE_API_URL,
  timeout: 10000,
  headers: {}
}

// 请求成功-拦截器
export function requestSuccess (config) {
  // TODO 配置必传参数、公共头部
  // config.baseURL = '/api/'
  return config
}

// 请求失败-拦截器
export function requestError (error) {
  // TODO 统一错误提示
  return Promise.reject(error)
}

// 响应成功-拦截器
export function responseSuccess (response) {
  // TODO 统一成功信息提示、数据拆解
  return response.status === 200 ? response.data : response
}

// 响应失败-拦截器
export function responseError (error) {
  // TODO 统一错误提示
  console.log(error)
  const message = error && error.data && error.data.message ? error.data.message : ''
  const status = error.status ? error.status.toString() : ''
  if (status.startsWith('50')) {
    Vue.prototype.$message.error(message || 'Server Error!')
  }
  if (status.startsWith('40')) {
    Vue.prototype.$message.error(message || 'Client Error!')
  }
  return Promise.reject(error)
}
