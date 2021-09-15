<template>
    <div v-for="(item) in conversationMessageList.filter((element, index) => index >= pageOffset && index < (pageOffset + limit))" v-bind:key="item.id">
      <Message :message="item" :userId="userId"></Message>
    </div>
</template>

<script lang="ts">
import { Conversation, Message as MessageType } from '@/types/SkypeExport';
import { defineComponent } from 'vue'
import Message from "../components/Message.vue"

export default defineComponent({
  name: 'SkypeConversation',
  data() {
    return {
      limit: 500,
      page: 1,
    }
  },
  components: {
    Message
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
  },
  mounted() {
    this.$store.commit('parseConversation', this.$route.params.id)
  }
})
</script>

<style scoped>

#conversation-container {
  height: calc(100vh - 80px);
}

#conversation-header {
  height: 80px;
}

</style>
