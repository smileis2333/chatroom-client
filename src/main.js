import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import router from "@/router";



import moment from 'moment'


Vue.filter('formatDate', function (value,pattern='MM/DD/YYYY hh:mm') {
  if (value) {
    return moment(new Date(value)).format(pattern)
  }
})

Vue.use(VueRouter)
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
