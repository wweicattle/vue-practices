import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import "assets/css/base.css"
import Axios from 'axios'
import TreeTable from "vue-table-with-tree-grid"

Vue.config.productionTip = false;
Vue.component("table-tree",TreeTable)
// 进行一层请求头中添加token
Axios.interceptors.request.use(
  config => {
      config.headers.Authorization = window.sessionStorage.getItem("token");
      return config;
  },
  err => {
      console.log("拦截失败！");
  }
);
// 默认的baseurl
Axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/";
Vue.prototype.$http = Axios;


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
