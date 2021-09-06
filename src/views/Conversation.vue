<template>
    <div v-if="conversation">
    Conversation with {{ id }}
    <div id="conversation" >
      <div v-for="(item) in conversationMessageList" v-bind:key="item.id" class="p-5"><Message :message="item" :userId="userId"></Message></div>
    </div>
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
      limit: 10
    }
  },
  components: {
    Message
  },
  computed: {
    id() { return this.$route.params.id; },
    conversation(): Conversation | undefined { return this.$store.state.conversations.find(element => element.id == this.$route.params.id); },
    conversationMessageList(): MessageType[] { return this.conversation?.MessageList || [] },
    // this does not work because the data will be edited in a message and e_m will be removed
    // here it would be better to this all as pre-process when loading the data into the store
    filteredConversationMessageList(): MessageType[] {
      const newList: MessageType[] = []

      for (var element of this.conversationMessageList) {

        // it might be able to this over the e_m attribute ts_ms
        if (!element.em) newList.push(element)
        else {
          // is edited
          if (!newList.some(message => message.content === element.content)) newList.push(element)
        }
      }

      console.log('origin: ' + this.conversationMessageList.length)
      console.log('new: ' + newList.length)

      return newList;
    },
    userId() { return this.$store.state.userId; },
  },
  mounted() {
    this.$store.commit('parseConversation', this.$route.params.id)
  }
})
</script>

<style scoped>
* {
  max-width: 1000px;
  margin: 0 auto;
}

#conversation {
  background-color: #eff8ff;
}
</style>
