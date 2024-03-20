export default ({store}) => {
  if (process.browser) {
    console.log('process.browser')
    // 客户端环境
    store.state.userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : ''
    store.state.token = localStorage.getItem('token') || ''
    store.state.isRemember = localStorage.getItem('isRemember') || false
    store.state.resultKeyWords = localStorage.getItem('resultKeyWords') || null

  }
}
