import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import api from './jaso_api/api'
//import Mock from './mock'
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import utils from './common/js/util.js'
Vue.prototype.api = api
Vue.prototype.utils = utils
Vue.use(ElementUI)
Vue.use(VueRouter)

//NProgress.configure({ showSpinner: false });


Array.prototype._get = function (value, name) {
    for (let i = 0; i < this.length; i ++) {
      if (this[i][name] == value) {
         return this[i]
      }
    }
    return null
}
const router = new VueRouter({
  routes
})
new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

