<template>
    <div v-for="(item) in conversationMessageList.filter((element, index) => index >= pageOffset && index < (pageOffset + limit))" v-bind:key="item.id" class="p-5"><Message :message="item" :userId="userId"></Message></div>

  <!--
  <div id="conversation">
    <div id="conversation-header" class="text-left fixed w-full bg-white">
      <div class="flex justify-between font-bold text-xl">{{ displayName }}</div>
    </div>
    <div id="conversation-content">
      <div v-for="(item) in conversationMessageList.filter((element, index) => index >= pageOffset && index < (pageOffset + limit))" v-bind:key="item.id" class="p-5"><Message :message="item" :userId="userId"></Message></div>
    </div>
  </div>
  -->
  <!--<div v-if="conversation">
    <div>Conversation with {{ id }}</div>-->
    <!--<div v-for="(item) in conversationMessageList" v-bind:key="item.id" class="p-5"><Message :message="item" :userId="userId"></Message></div>-->
    <!--<div v-for="(item) in conversationMessageList.filter((element, index) => index >= pageOffset && index < (pageOffset + limit))" v-bind:key="item.id" class="p-5"><Message :message="item" :userId="userId"></Message></div>-->
  <!--</div>-->
  <!--
  <div v-if="conversation" class="text-center">
    Conversation with {{ id }}
    <div v-if="Math.ceil(conversationSize / limit) > 0">
      <button v-if="page > 1" class="pr-5" v-on:click="page -= 1">&#60;</button>
      <button v-if="page < Math.ceil(conversationSize / limit)" class="pl-5" v-on:click="page += 1">&#62;</button>
    </div>
    <div id="conversation">
      <div v-for="(item) in conversationMessageList.filter((element, index) => index >= pageOffset && index < (pageOffset + limit))" v-bind:key="item.id" class="p-5"><Message :message="item" :userId="userId"></Message></div>
    </div>
  </div>
  -->
</template>

<script lang="ts">
import { Conversation, Message as MessageType } from '@/types/SkypeExport';
import { defineComponent } from 'vue'
import Message from "../components/Message.vue"

export default defineComponent({
  name: 'SkypeConversation',
  data() {
    return {
      limit: 100,
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
    displayName() { return this.$store.state.conversations.find(element => element.id == this.$route.params.id)?.displayName },
    conversation(): Conversation | undefined { return this.$store.state.conversations.find(element => element.id == this.$route.params.id); },
    conversationSize(): number { return this.conversation?.MessageList.length || 1 },
    conversationMessageList(): MessageType[] { return this.conversation?.MessageList || [] },
    userId() { return this.$store.state.userId; },
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
