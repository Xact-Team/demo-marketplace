import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import axios from "axios"
import store from './store'
import './index.css'

axios.defaults.baseURL = process.env.VUE_APP_BACKEND_URI

createApp(App).use(store).use(router).mount('#app')
