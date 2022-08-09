import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) {
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logOut') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject('token超时了')
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(response => {
  const { data: { data, message, success }} = response
  if (success) {
    return data
  }
  Message.error(message || '登录失败')
  return Promise.reject(message || '登录失败')
}, error => {
  if (error.response.status === 401) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
})
const TimeOut = 36000000 // 定义超时时间 单位s
// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  // var currentTime = Date.now() // 当前时间戳
  // var timeStamp = getTimeStamp() // 缓存时间戳
  return Date.now() - getTimeStamp() > TimeOut
}
export default request
