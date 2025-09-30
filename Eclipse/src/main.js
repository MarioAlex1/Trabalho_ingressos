import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import darkModePlugin from './plugins/darkModeSimple.js'

createApp(App).use(router).use(darkModePlugin).mount('#app')
