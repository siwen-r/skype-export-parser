<template>
  <div class="flex flex-col h-screen">
    <header class="flex justify-between p-5">
      <div v-if="isConversation" class="flex justify-start items-end font-black text-3xl">
        <span class="skype">Skype </span>Export Parser
        <span v-if="!production" class="text-red-700 rounded-b-lg pl-2">DEV MODE</span>
      </div>
      <div v-else></div>
      <div class="space-x-3">
        <font-awesome-icon v-if="isConversation" class="cursor-pointer" size="2x" :icon="['fas', 'upload']" @click="$store.commit('clearData')" />
        <a href="https://github.com/siwen-r/skype-export-parser" target="_blank"><font-awesome-icon class="cursor-pointer" size="2x" :icon="['fab', 'github']" /></a>
        <font-awesome-icon class="cursor-pointer" size="2x" v-if="dark" :icon="['fas', 'sun']" @click="updateDarkMode('light')" />
        <font-awesome-icon class="cursor-pointer" size="2x" v-else :icon="['fas', 'moon']" @click="updateDarkMode('dark')" />
      </div>
    </header>
    <div class="flex-1 mb-10">
      <div v-if="isConversation"><Home/></div>
      <div v-else class="page-centered"><Landing/></div>
    </div>
    <footer v-if="!isConversation" class="flex-shrink-0 mb-2 page-centered">{{ $t('footer.disclaimer') }}</footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Home from './views/Home.vue'
import Landing from './views/Landing.vue'

export default defineComponent({
  name: 'App',
  components: { Home, Landing },
  data() {
    return {
      dark: false
    }
  },
  computed: {
    isConversation() { return this.$store.state.conversations.length > 0 },
    production() { return import.meta.env.PROD }
  },
  methods: {
    // https://tailwindcss.com/docs/dark-mode
    isDarkTheme() { return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) },
    updateDarkMode(theme: string) {
      localStorage.theme = theme;
      this.setDarkMode(theme === 'dark' ? true : false)
    },
    setDarkMode(dark: boolean) {
      // https://tailwindcss.com/docs/dark-mode
      this.dark = dark
      if (dark)  document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  },
  mounted() {
    this.dark = this.isDarkTheme();
    this.setDarkMode(this.dark)
  }
})
</script>

<style>
@font-face {
  font-family: 'Roboto Slab';
  font-style: normal;
  font-weight: 400;
  src: url('./fonts/roboto-slab-v13-latin-regular.eot'); /* IE9 Compat Modes */
  src: local(''),
       url('./fonts/roboto-slab-v13-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('./fonts/roboto-slab-v13-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
       url('./fonts/roboto-slab-v13-latin-regular.woff') format('woff'), /* Modern Browsers */
       url('./fonts/roboto-slab-v13-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
       url('./fonts/roboto-slab-v13-latin-regular.svg#RobotoSlab') format('svg'); /* Legacy iOS */
}

#app {
  height: 100%;
}

.skype {
  color: #00AFF0;
}

.skype-background {
  background-color: #00AFF0;
}

.page-centered {
  max-width: 800px;
  margin: auto;
}
</style>
