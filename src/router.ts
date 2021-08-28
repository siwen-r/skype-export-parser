import { createRouter, createWebHistory } from 'vue-router'
import Home from "./views/Home.vue"
import SkypeConversation from "./views/SkypeConversation.vue"

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Skype Export Parser', component: Home },
    { path: '/conversation/:id', name: 'Skype Conversation', component: SkypeConversation }
  ],
})
