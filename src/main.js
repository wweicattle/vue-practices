import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import "assets/css/base.css"
import Axios from 'axios'
import TreeTable from "vue-table-with-tree-grid"
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import nprogress from "nprogress"
import "nprogress/nprogress.css"


// 进行全局安装富文本组件
Vue.use(VueQuillEditor)



Vue.config.productionTip = false;
Vue.component("table-tree", TreeTable);
Vue.filter("changeTime", function (value) {
  let newt = new Date(value);
  var y = newt.getFullYear();
  var m = newt.getMonth() + 1;
  if (m.toString().length === 1) {
    m = m.toString().padStart(2, 0);;
  }
  var d = newt.getDate();
  var h = newt.getHours();
  var s = newt.getMinutes();
  return (y + "-" + m + "-" + d + " " + h + ":" + s);
})


// 进行一层请求头中添加token
Axios.interceptors.request.use(
  config => {
    nprogress.start();
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
  },
  err => {
    console.log("拦截失败！");
  }
);
Axios.interceptors.response.use(
  config => {
    nprogress.done();
    return config
  }
);
// 默认的baseurl
Axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Vue.prototype.$http = Axios;


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
