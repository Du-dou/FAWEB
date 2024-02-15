export default ({store}) => {
  if (process.browser) {
    console.log('process.browser')
    // 客户端环境
    // console.log(store.state.hasLogin)
    // store.commit('setHasLogin', hasLogin);
    store.state.hasLogin = localStorage.getItem('hasLogin') || false;
    store.state.userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : ''
    store.state.token = localStorage.getItem('token') || ''
    store.state.isRemember = localStorage.getItem('isRemember') || false
    store.state.resultKeyWords = localStorage.getItem('resultKeyWords') || null

  }
}
