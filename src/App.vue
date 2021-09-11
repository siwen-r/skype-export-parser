<template>
  <header class="flex justify-between p-5">
    <div class="flex justify-start">
      <router-link to="/"><img src="skype.svg" alt="skype logo"></router-link>
      <router-link to="/" class="text-3xl font-black pl-2">Export Parser</router-link>
    </div>
    <div class="flex justify-end">
      <div class="font-black self-center pr-2">{{ user }}</div>
      <UserIcon class="h-7 w-7 self-center" />
    </div>
  </header>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserIcon } from '@heroicons/vue/solid'

export default defineComponent({
  name: 'App',
  components: { UserIcon },
  computed: {
    isConversation() { return this.$store.state.conversations.length > 0 },
    user() { return this.$store.state.userId; }
  },
  methods: {
    async loadDemoData() {
      if (!this.isConversation) {
        const runtimeConfig: any = await fetch("/demo/messages.json");
        this.$store.commit('setExport', await runtimeConfig.json());
      }
    }
  },
  mounted() {
    this.loadDemoData();
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
</style>
