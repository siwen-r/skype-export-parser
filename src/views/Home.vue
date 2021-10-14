<template>
  <div class="flex justify-between">
    <div class="w-1/4 pl-5 relative pr-5" id="sidebar">
      <div class="font-bold text-lg">Export Details</div>
      <div class="flex justify-start"><UserIcon class="h-5 w-5 self-center" /><div class="self-center pl-2">{{ userId }}</div></div>
      <div class="flex justify-start"><ClockIcon class="h-5 w-5 self-center" /><div class="self-center pl-2">{{ exportDate }}</div></div>
      <div class="font-bold pt-5 pb-2 text-lg">Conversations</div>
      <div id="conversaions" class="divide-y-2 divide-solid overscroll-auto overflow-auto">
        <div v-for="con in conversations" v-bind:key="con.id" class="pt-2 pb-2 conversation-list-container">
          <div class="flex justify-start text-gray-300 dark:text-gray-700"><ClockIcon class="h-5 w-5 self-center" /><div class="self-center">{{ dateToLocal(con.MessageList[ con.MessageList.length - 1 ].originalarrivaltime) }}</div></div>
          <div class="font-bold cursor-pointer" @click="getConversation(con.id)" v-bind:class="{ 'skype': ( conversation ? con.id == conversation.id : false ) }"><div v-if="con.displayName">{{ con.displayName }}</div><div v-else>{{ con.id }}</div></div>
          <div class="truncate">{{ getMessageContent(con.MessageList[ con.MessageList.length - 1 ]) }}</div>
        </div>
      </div>
    </div>
    <div class="w-3/4">
      <div v-if="!conversation" id="empty-conversation" class="flex items-center justify-center w-3/4">
        <div>No Conversation select</div>
      </div>
      <div v-else id="empty-conversation" class="flex flex-col w-full">
        <div class="flex flex-col text-left fixed w-full h-24 dark:border-b-2">
          <div class="flex justify-between font-bold text-xl">{{ conversation.displayName }}</div>
          <div class="flex justify-around space-x-10 p-4 font-bold w-3/4">
            <div @click="gallery = false" class="cursor-pointer" v-bind:class="{ 'skype': !gallery }">Chat</div>
            <div @click="gallery = true" class="cursor-pointer" v-bind:class="{ 'skype': gallery }">Gallery</div>
          </div>
        </div>
        <div v-if="conversation && !gallery" id="conversation-container" class="mt-24 text-center flex-1 overflow-y-auto shadow-inner p-5 relative">
          <div class="pr-20 pl-20 relative">
            <div v-for="(item, index) in messageList" v-bind:key="index"><MessageComponent :message="item" :userId="userId"></MessageComponent></div>
            <div v-if="conversation.MessageList.length != 0" id="scroll-top" v-on:click="scrollTop()"><ChevronDoubleUpIcon class="h-10 w-10 rounded-md border p-1" /></div>
            <div v-if="conversation.MessageList.length != 0" id="scroll-bottom" v-on:click="scrollBottom()"><ChevronDoubleDownIcon class="h-10 w-10 rounded-md border p-1" /></div>
          </div>
        </div>
        <div v-if="gallery" id="conversation-container" class="flex flex-row justify-center flex-wrap mt-24 text-center flex-1 overflow-y-auto shadow-inner p-5">
          <div v-for="(messages, indexMessage) in imageList" v-bind:key="indexMessage">
            <div v-for="(item, index) in messages.images" v-bind:key="index" class="relative galleryimage">
              <img :imagename="item.name" :src="item.blob" alt="404 BILD NOT FOUND" loading="lazy" class="absolute inset-0 z-0 galleryimage p-2">
              <a :href="item.blob" class="opacity-0 hover:opacity-80 hover:bg-black duration-300 absolute inset-0 z-10 flex justify-center items-center text-white p-1 cursor-pointer" download>
                <font-awesome-icon size="2x" :icon="['fas', 'download']" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Conversation, Message } from '@/types/SkypeExport';
import { defineComponent } from 'vue';
import { UserIcon, ClockIcon, SortAscendingIcon, SortDescendingIcon, ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/vue/solid'
import MessageComponent from '../components/Message.vue'

export default defineComponent({
  name: "SkypeExportParser",
  components: { UserIcon, ClockIcon, SortAscendingIcon, SortDescendingIcon, ChevronDoubleDownIcon, ChevronDoubleUpIcon, MessageComponent },
  data() {
    return {
      conversation: undefined,
      gallery: false,
    }
  },
  computed: {
    userId() { return this.$store.state.userId; },
    exportDate() { return this.$store.state.exportDate; },
    conversations(): Conversation[] { return this.$store.state.conversations; },
    messageList() { return this.conversation?.MessageList || []; },
    imageList() {return this.conversation?.MessageList.filter((element: Message) => element.messagetype === 'RichText/UriObject') || [] },
    isConversation() { return this.$store.state.conversations.length > 0 },
    user() { return this.$store.state.userId; },
    production() { return import.meta.env.PROD },
  },
  methods: {
    dateToLocal(date: string) { return new Date(date).toLocaleString(); },
    getMessageContent(message: Message) {
      let content = '';
      if (message.messagetype == "Event/Call") content = "Anruf"
      if (message.messagetype == 'Text' || message.messagetype == 'RichText') content = message.content
      if (message.messagetype == 'RichText/UriObject') content = "Bild"

      return content;
    },
    scrollTop() {
      const element = document.getElementById('conversation-container');
      if(element) element.scrollTop = 0;
    },
    scrollBottom() {
      const element = document.getElementById('conversation-container');
      if(element) element.scrollTop = element.scrollHeight;
    },
    async getConversation(conversationId: string) {
      if (!conversationId) return;

      this.conversation = undefined;
      this.conversation = this.$store.state.conversations.find(element => element.id == conversationId);
      this.gallery = false;
    }
  }
});
</script>

<style scoped>
* {
  text-align: left;
}

#conversaions {
  height: calc(100vh - 213px);
}

#empty-conversation {
  height: calc(100vh - 80px);
}

.conversation-list-container {
  min-height: 90px;
}

#conversation-container {
  height: calc(100vh - 80px);
}

#scroll-top {
  position: fixed;
  top: 50px;
  right: 30px;
  transform: translateY(156px);
}

#scroll-bottom {
  position: fixed;
  bottom: 30px;
  right: 30px;
}

.galleryimage {
  height: 250px;
  width: 250px;
  object-fit: cover;
}
</style>
