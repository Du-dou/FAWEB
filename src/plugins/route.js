export default ({app, store}) => {
  app.router.beforeEach((to, from, next) => {
    console.log('beforeEach')
    next()
    return
    if (to.meta.auth) {
      if (!store.state.hasLogin) {
        next({
          path: '/home'
        })
      } else {
        next()
      }
    } else {
      next()
    }

  })
}
