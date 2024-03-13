// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import {
  Pagination,
  Message,
  MessageBox,
  Loading,
  Container,
  Tree,
  Timeline,
  TimelineItem,
  Tooltip
} from 'element-ui'


Vue.use(Pagination)
Vue.use(Container)
Vue.use(Loading.directive)
Vue.use(Tree)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Tooltip)
Vue.use(Checkbox)

Vue.prototype.$loading = Loading.service;

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$prompt = MessageBox.prompt;


// import VueAwesomeSwiper from 'vue-awesome-swiper'


// import style (>= Swiper 6.x)
// import 'swiper/swiper-bundle.css'
import Checkbox from "element-ui/packages/checkbox";

// import style (<= Swiper 5.x)
// import 'swiper/css/swiper.css'

// Vue.use(VueAwesomeSwiper, /* { default options with global component } */ )

Vue.config.productionTip = false
Vue.prototype.$url = 'https://www.lawsees.com/file/';
// Vue.prototype.$url = 'http://119.3.231.128:30140/file/';

axios.interceptors.response.use(response => {
  //接收到响应后要做些什么，比如跳转到登录页
  if (response.data.code == 2) {
    store.commit('logout', true)
    router.push({
      path: '/home'
    })
  } else if(response.data.code == 9){
    store.commit('logout', true)
    Message.error(response.data.mess);
    router.push({
      path: '/home'
    })
  }else {
    return Promise.resolve(response)
  }

  return response
}, error => {
  //对响应错误做些什么
  return Promise.reject(error)
})



/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   store,
//   components: {
//     App
//   },
//   template: '<App/>'
// })
