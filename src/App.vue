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
  methods: {
    async loadDemoData() {
    const runtimeConfig: any = await fetch("/messages.json");
    this.$store.commit('setExport', await runtimeConfig.json());
    }
  },
  mounted() {
    this.loadDemoData();
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
