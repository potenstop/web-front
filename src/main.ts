import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import JsonEditor from 'vue-json-edit'

Vue.config.productionTip = false
Vue.use(iView);

Vue.use(VueHighlightJS)
Vue.use(JsonEditor)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
