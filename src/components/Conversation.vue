<template>
  <div class="pr-20 pl-20 relative">
    <div id="conversaation-inner-container">
      <div v-for="(item) in messages" v-bind:key="item.id"><Message :message="item" :userId="userId"></Message></div>
    </div>
    <div id="scroll-top" v-on:click="scrollTop()"><ChevronDoubleUpIcon class="h-10 w-10 rounded-md border p-1" /></div>
    <div id="scroll-bottom" v-on:click="scrollBottom()"><ChevronDoubleDownIcon class="h-10 w-10 rounded-md border p-1" /></div>
  </div>
</template>

<script lang="ts">
import { Conversation, Message as MessageType } from '@/types/SkypeExport';
import { defineComponent } from 'vue'
import Message from "../components/Message.vue"
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/vue/solid'

export default defineComponent({
  name: 'SkypeConversation',
  components: { Message, ChevronDoubleDownIcon, ChevronDoubleUpIcon },
  data() {
    return {
      limit: 500,
      page: 1,
    }
  },
  computed: {
    callculatePage() {
      const message = this.conversationMessageList;

      if(!message) return 1;
      return (message.length / this.limit);
    },
    pageOffset() { return (this.page - 1) * this.limit; },

    id() { return this.$route.params.id; },
    userId() { return this.$store.state.userId; },
    conversation(): Conversation | undefined { return this.$store.state.conversations.find(element => element.id == this.$route.params.id); },
    conversationMessageList(): MessageType[] { return this.conversation?.MessageList || [] },
    messages(): MessageType[] { return this.$store.getters.getMessages({ conversationId: this.$route.params.id, limit: this.limit, offset: (this.page - 1) }) },
  },
  methods: {
    scrollTop() {
      const element = document.getElementById('conversation-container');
      if(element) element.scrollTop = 0;
    },
    scrollBottom() {
      const element = document.getElementById('conversation-container');
      if(element) element.scrollTop = element.scrollHeight;
    }
  }
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
