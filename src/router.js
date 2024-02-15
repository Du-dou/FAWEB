import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


import Home from "@/pages/Home/Home.vue"
import Result from "@/pages/result/result"
import Center from "@/pages/user/center"
import ChangePassword from "@/pages/user/changeWord"
import MyAuth from "@/pages/user/myAuth"
import ModifyPhone from "@/pages/user/modifyPhone"
import Message from "@/pages/user/message"
import Collection from "@/pages/user/collection"
import UserInfo from "@/pages/user/userInfo"
import ForgetPassword from "@/pages/forgetPassword/forgetPassword"
import Details from "@/pages/details/details"
import Page404 from "@/pages/page404/page404"
import Pay from "@/pages/pay/pay"
import singlePay from "@/pages/pay/single_pay"

// 疑似废弃
// import Login2 from "@/pages/link/link"
//


Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '',
        redirect: '',
        component: Home
      },
      {
        path: '/home',
        meta: {
          auth: false,
        },
        name: 'home',
        component: Home
      },
      {
        path: '/result',
        name: 'result',
        meta: {
          auth: true,
        },
        component: Result
      },
      // {
      //   path: '/link',
      //   name: 'link',
      //   meta: {
      //     auth: false
      //   },
      //   component: Login2
      // },
      {
        path: '/detail/:id',
        name: 'Details',
        meta: {
          auth: false
        },
        component: Details
      },
      {
        redirect: '/user/center/changepassword',
        path: '/user/center',
        name: 'center',
        meta: {
          auth: true,
        },
        component: Center,
        children: [
          {
            path: 'changepassword',
            component: ChangePassword,
            name: 'ChangePassword',
            meta: {
              auth: true
            }
          }, {
            path: 'myAuth',
            component: MyAuth,
            name: 'MyAuth',
            meta: {
              auth: true
            }
          }, {
            path: "modifyPhone",
            component: ModifyPhone,
            name: 'ModifyPhone',
            meta: {
              auth: true
            }
          },
          {
            path: 'message',
            component: Message,
            name: 'Message',
            meta: {
              auth: true
            }
          }, {
            path: 'collection',
            component: Collection,
            name: 'Collection',
            meta: {
              auth: true
            }
          }, {
            path: 'info',
            component: UserInfo,
            name: 'UserInfo',
            meta: {
              auth: true
            }
          }
        ]
      },
      {
        path: '/forgetPassword',
        meta: {
          auth: false
        },
        name: 'ForgetPassword',
        component: ForgetPassword
      },
      {
        path: '/404',
        meta: {
          auth: false
        },
        component: Page404
      },
      {
        path: '/pay',
        meta: {
          auth: true
        },
        component: Pay
      },
      {
        path: '/singlePay/:id',
        meta: {
          auth: true
        },
        component: singlePay
      },
      {
        path: '*',
        redirect: '/404'
      }]
  })
}

