import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/sequence/json',
      name: 'sequenceMyJson',
      component: () => import(/* webpackChunkName: "about" */ './views/sequence/Json.vue'),
      meta: {
        title: 'json序列化'
      }
    },
    {
      path: '/encrypt/decode',
      name: 'encryptDecode',
      component: () => import(/* webpackChunkName: "about" */ './views/encrypt/Decode.vue'),
      meta: {
        title: '加密'
      }
    },
    {
      path: '/encrypt/encode',
      name: 'encryptEncode',
      component: () => import(/* webpackChunkName: "about" */ './views/encrypt/Encode.vue'),
      meta: {
        title: '解密'
      }
    },
    {
      path: '/code',
      name: 'code',
      component: () => import(/* webpackChunkName: "about" */ './views/code/Code.vue'),
      meta: {
        title: '解密'
      }
    },
    {
      path: '/office/execl',
      name: 'officeExecl',
      component: () => import(/* webpackChunkName: "about" */ './views/office/Execl.vue'),
      meta: {
        title: '在线表格'
      }
    },
    {
      path: '/generate/spring-boot',
      name: 'generateSpringBootApi',
      component: () => import(/* webpackChunkName: "about" */ './views/generate/SpringBoot.vue'),
      meta: {
        title: '在线表格'
      }
    }

  ]
})
