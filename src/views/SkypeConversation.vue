<template>
  Conversation with {{ id }}
  <div v-for="message in conversation.MessageList" v-bind:key="message.id"><Message :message="message"></Message></div>
</template>

<script lang="ts">
import { Conversation } from '@/types/SkypeExport';
import { defineComponent } from 'vue'
import Message from "../components/Message.vue"

export default defineComponent({
  name: 'SkypeConversation',
  components: {
    Message
  },
  computed: {
    id() { return this.$route.params.id; },
    conversation(): Conversation | undefined { return this.$store.state.conversations.find(element => element.id == this.$route.params.id); }
  }
})
</script>

<style scoped>
* {
  text-align: left;
  white-space: nowrap;
}
</style>
