import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import qs from 'qs';

import { Indicator } from 'mint-ui';

Vue.config.productionTip = false
Vue.prototype.$axios = axios  /* 全局使用axios */

axios.defaults.baseURL = 'https://ele-interface.herokuapp.com/';

Vue.use(MintUI)

// 请求拦截，发起axios请求的时候开启加载动画
axios.interceptors.request.use(
  config => {
    if (config.method == 'post') {
      config.data = qs.stringify(config.data);
    }

    // 加载动画
    Indicator.open({
      spinnerType: 'double-bounce'
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截，axios成功获取到数据时关闭加载动画
axios.interceptors.response.use(
  response => {
    Indicator.close();
    return response;
  },
  error => {
    // 错误提醒
    Indicator.close();
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
