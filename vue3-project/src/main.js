import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import App from './App.vue'
import routes from '@/router'
import Store from '@/store'

const router = createRouter({
  mode: createWebHistory(),
  routes
})

const store = createStore(Store)

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
