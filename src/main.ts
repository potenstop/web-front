import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// @ts-ignore
import iView from 'iview'
import './assets/icons/iconfont.css'
import 'iview/dist/styles/iview.css'
import 'highlight.js/styles/atom-one-dark.css'
Vue.config.productionTip = false
Vue.use(iView)
router.beforeEach(async (to, from, next) => {
  if (to.meta) {
    document.title = to.meta.title
  }
  store.commit('syncLoginState')
  if (store.getters.offLine) {
    await store.dispatch('authUser')
  }
  await next()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
