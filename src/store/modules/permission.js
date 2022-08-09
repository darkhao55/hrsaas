import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    const resRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    // vuex>>作用>>左侧菜单的展示
    // addRoutes进行添加>>添加到路由表,让用户可以访问
    context.commit('setRoutes', resRoutes)
    return resRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
