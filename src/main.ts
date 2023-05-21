import { createApp } from 'vue'
import router from '@/router/index'
import { key, store } from '@/store'
import App from './App.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/base.styl'
import useDirective from '@/common/directive'

const app = createApp(App)

useDirective(app)

app.use(router).use(store, key).mount('#app')
