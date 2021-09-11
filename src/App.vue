<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
  </div>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  computed: {
    isConversation() { return this.$store.state.conversations.length > 0 }
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

* {
  background-color: #eff8ff;
  text-align: center;
}
</style>
