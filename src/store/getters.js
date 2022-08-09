const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  conpanyId: state => state.user.userInfo.conpanyId,
  routes: state => state.permission.routes
}
export default getters
