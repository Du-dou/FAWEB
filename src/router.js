import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


import Home from "@/pages/Home/Home.vue"
import Result from "@/pages/result/result.html.vue"
import Center from "@/pages/user/center"
import ChangePassword from "@/pages/user/changeWord.html.vue"
import MyAuth from "@/pages/user/myAuth"
import ModifyPhone from "@/pages/user/modifyPhone"
import Message from "@/pages/user/message"
import Collection from "@/pages/user/collection"
import UserInfo from "@/pages/user/userInfo"
import ForgetPassword from "@/pages/forgetPassword/forgetPassword"
import Details from "@/pages/details/details.html.vue"
import Page404 from "@/pages/page404/page404"
import Pay from "@/pages/pay/pay"
import singlePay from "@/pages/pay/single_pay"

// TODO 登录跳转 要带参数
import Login2 from "@/pages/link/link"



Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '',
        redirect: '',
        meta: {
          auth: false,
        },
        name: 'home',
        component: Home
      },
      {
        path: '/result.html',
        name: 'result',
        meta: {
          auth: true,
        },
        component: Result
      },
      {
        path: '/link',
        name: 'link',
        meta: {
          auth: false
        },
        component: Login2
      },
      {
        path: '/:id.html',
        name: 'Details',
        meta: {
          auth: false
        },
        component: Details
      },
      {
        redirect: '/user/changepassword.html',
        path: '/user',
        name: 'center',
        meta: {
          auth: true,
        },
        component: Center,
        children: [
          {
            path: 'changepassword.html',
            component: ChangePassword,
            name: 'ChangePassword',
            meta: {
              auth: true
            }
          }, {
            path: 'myAuth.html',
            component: MyAuth,
            name: 'MyAuth',
            meta: {
              auth: true
            }
          }, {
            path: "modifyPhone.html",
            component: ModifyPhone,
            name: 'ModifyPhone',
            meta: {
              auth: true
            }
          },
          {
            path: 'message.html',
            component: Message,
            name: 'Message',
            meta: {
              auth: true
            }
          }, {
            path: 'collection.html',
            component: Collection,
            name: 'Collection',
            meta: {
              auth: true
            }
          }, {
            path: 'info.html',
            component: UserInfo,
            name: 'UserInfo',
            meta: {
              auth: true
            }
          }
        ]
      },
      {
        path: '/forgetPassword.html',
        meta: {
          auth: false
        },
        name: 'ForgetPassword',
        component: ForgetPassword
      },
      {
        path: '/404.html',
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
        path: '/singlePay/:id.html',
        meta: {
          auth: true
        },
        component: singlePay
      },
      {
        path: '*',
        redirect: '/404.html'
      }]
  })
}

