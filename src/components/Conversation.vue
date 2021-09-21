<template>
  <div v-if="messages.length > 0" class="pr-20 pl-20 relative">
    <div id="conversaation-inner-container">
      <div v-for="(item) in messages" v-bind:key="item.id"><Message :message="item" :userId="userId"></Message></div>
    </div>
    <div id="scroll-top" v-on:click="scrollTop()"><ChevronDoubleUpIcon class="h-10 w-10 rounded-md border p-1" /></div>
    <div id="scroll-bottom" v-on:click="scrollBottom()"><ChevronDoubleDownIcon class="h-10 w-10 rounded-md border p-1" /></div>
  </div>
  <div v-else class="flex items-center justify-center">
    <span class="animate-spin"><RefreshIcon class="h-10 w-10 self-center" /></span><span class="self-center pl-2 font-black">Loading Conversation</span>
  </div>
</template>

<script lang="ts">
import { Message as MessageType } from '@/types/SkypeExport';
import { defineComponent } from 'vue'
import Message from "../components/Message.vue"
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, RefreshIcon } from '@heroicons/vue/solid'

export default defineComponent({
  name: 'SkypeConversation',
  components: { Message, ChevronDoubleDownIcon, ChevronDoubleUpIcon, RefreshIcon },
  data() {
    return {
      // messages: []
    }
  },
  computed: {
    userId() { return this.$store.state.userId; },
    messages(): MessageType[] { return this.$store.getters.getMessages(this.$route.params.id) },
  },
  methods: {
    scrollTop() {
      const element = document.getElementById('conversation-container');
      if(element) element.scrollTop = 0;
    },
    scrollBottom() {
      const element = document.getElementById('conversation-container');
      if(element) element.scrollTop = element.scrollHeight;
    },
    async loadConversation() {
      this.messages = [] // clear all messages
      this.messages = await this.$store.getters.getMessages(this.$route.params.id);
      console.log(`Finished loading for ${this.$route.params.id} with message ${this.messages.length}`)
    }
  },
})
</script>

<style scoped>

#conversation-container {
  height: calc(100vh - 80px);
}

#scroll-top {
  position: fixed;
  top: 30px;
  right: 30px;
  transform: translateY(156px);
}

#scroll-bottom {
  position: fixed;
  bottom: 30px;
  right: 30px;
}
</style>
