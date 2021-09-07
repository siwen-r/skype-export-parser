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
* {
  background-color: #eff8ff;
  text-align: center;
}
</style>
