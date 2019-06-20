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
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/sequence/json',
      name: 'sequenceMyJson',
      component: () => import(/* webpackChunkName: "about" */ './views/sequence/Json.vue')
    },
    {
      path: '/encrypt/decode',
      name: 'encryptDecode',
      component: () => import(/* webpackChunkName: "about" */ './views/encrypt/Decode.vue')
    },
    {
      path: '/encrypt/encode',
      name: 'encryptEncode',
      component: () => import(/* webpackChunkName: "about" */ './views/encrypt/Encode.vue')
    }

  ]
})
