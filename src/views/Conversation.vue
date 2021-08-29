<template>
    <div v-if="conversation">
    Conversation with {{ id }}
    <div id="conversation" >
      <div v-for="message in conversationMessageList" v-bind:key="message.id" class="p-5">
        <Message :message="message" :userId="userId"></Message>

        <!--
        <div v-if="message.messagetype == 'Text' || message.messagetype == 'RichText'" class="flex-col">
          <div
          class="flex p-2 bg-white rounded-xl shadow-md"
          v-bind:class="{ 'justify-end': message.from == userId, 'justify-start': message.from != userId, 'text-right': message.from == userId, 'text-left': message.from != userId }">
            {{ message.content }}<br>{{ message.id }}
          </div>
          -->
          <!--<div>{{ message.id }}</div>-->
          <!--
        </div>
        <div v-else-if="message.messagetype == 'Event/Call'" class="text-center">
          {{ xml = parseCallContent(message.content) }}
          <span v-if="xml.type == 'started'">Anruf begonnen</span>
          <span v-else-if="xml.type == 'ended'">Anruf beendet</span>
          <span v-else>Anruf<br>{{ xml }}</span>
          <br>
        </div>
        <div v-else>{{ message.messagetype }} </div>
        -->
        <!--
        <div v-if="message.from == userId" class="text-right">{{ message.content }}</div>
        <div v-else class="text-left">{{ message.content }}</div>
        -->
      </div>
    </div>

    <!--<div v-for="message in conversation.MessageList" v-bind:key="message.id"><Message :message="message"></Message></div>-->
  </div>
</template>

<script lang="ts">
import { Conversation, Message as MessageType } from '@/types/SkypeExport';
import { defineComponent } from 'vue'
import Message from "../components/Message.vue"

export default defineComponent({
  name: 'SkypeConversation',
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
        if (element.content.match(/<e_m(.*)<\/e_m>/g) == null) newList.push(element)
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
