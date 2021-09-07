import { createApp } from 'vue'
import '@google/model-viewer'
import router from './router'
import App from './App.vue'
import store from './store'
import axios from "axios"
import './index.css'

axios.defaults.baseURL = process.env.VUE_APP_BACKEND_URI

createApp(App).use(store).use(router).mount('#app')
