<template>
  <div class="flex flex-col h-screen">
    <div class="flex-1">
      <div v-if="isConversation"><Home/></div>
      <div v-else class="page-centered"><Landing/></div>
    </div>
    <footer class="flex-shrink-0 mt-10 mb-2">
      <div class="page-centered flex justify-between items-center">
        <div>Skype Export Parser is a hobby project and is not affiliated with Skype or Microsoft in any way.</div>
        <font-awesome-icon :icon="['fab', 'github']" />
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Home from './views/Home.vue'
import Landing from './views/Landing.vue'

export default defineComponent({
  name: 'App',
  components: { Home, Landing },
  computed: {
    isConversation() { return this.$store.state.conversations.length > 0 },
  },
  mounted() {
    this.$store.dispatch('loadDemoData')
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
