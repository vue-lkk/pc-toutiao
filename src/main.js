import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载element组件库
import ElementUI from 'element-ui'
// 引入element样式
// import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式
import './styles/index.less'

// 全局注册 element组件库，必须放到所有import的后面
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
