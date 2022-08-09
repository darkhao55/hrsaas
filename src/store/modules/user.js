import { getToken, setToken, removeToken } from '@/utils/auth.js'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(),
  userInfo: ''
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
    // console.log(userInfo)
  },
  removeUserInfo(state) {
    state.userInfo = ''
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    // 写入时间戳
    setTimeStamp() // 将当前的最新时间写入缓存
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    // 加一个点睛之笔  这里这一步，暂时用不到，但是请注意，这给我们后边会留下伏笔
    return baseResult
  },
  logOut(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
