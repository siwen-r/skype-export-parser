import { createRouter, createWebHistory } from 'vue-router'
import App from "./views/HelloWorld.vue"
import About from "./views/About.vue"
import SkypeExportParser from "./views/SkypeExportParser.vue"

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Hello World', component: App },
    { path: '/about', name: 'About', component: About },
    { path: '/parser', name: 'Skype Export Parser', component: SkypeExportParser }
  ],
})
