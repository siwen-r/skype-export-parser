<template>
  <div class="flex justify-between">
    <div class="w-1/4 pl-5 relative pr-5" id="sidebar">
      <div class="font-bold text-lg">Export Details</div>
      <div class="flex justify-start"><UserIcon class="h-5 w-5 self-center" /><div class="self-center pl-2">{{ userId }}</div></div>
      <div class="flex justify-start"><ClockIcon class="h-5 w-5 self-center" /><div class="self-center pl-2">{{ exportDate }}</div></div>
      <div class="font-bold pt-5 pb-2 text-lg">Conversations</div>
      <div id="conversaions" class="divide-y-2 divide-solid overscroll-auto overflow-auto">
        <div v-for="con in conversations" v-bind:key="con.id" class="pt-2 pb-2 conversation-list-container">
          <div class="flex justify-start text-gray-300"><ClockIcon class="h-5 w-5 self-center" /><div class="self-center">{{ dateToLocal(con.MessageList[ con.MessageList.length - 1 ].originalarrivaltime) }}</div></div>
          <router-link :to="`/conversation/${con.id}`" class="font-bold" v-bind:class="{ 'skype': con.id == conversationId }"><div v-if="con.displayName">{{ con.displayName }}</div><div v-else>{{ con.id }}</div></router-link>
          <div class="truncate">{{ getMessageContent(con.MessageList[ con.MessageList.length - 1 ]) }}</div>
        </div>
      </div>
    </div>
    <div class="w-3/4">
      <div v-if="!conversationId" id="empty-conversation" class="flex items-center justify-center w-3/4">
        <div>No Conversation select</div>
      </div>
      <div v-else id="empty-conversation" class="flex flex-col overscroll-auto overflow-auto w-full">
        <div class="text-left fixed w-full h-20 max-h-20 bg-white">
          <div class="flex justify-between font-bold text-xl">{{ conversationById.displayName }}</div>
        </div>
        <div id="conversation-container" class="mt-20 text-center flex-1 overflow-y-auto shadow-inner p-5 relative">
          <ConversationComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Conversation, Message } from '@/types/SkypeExport';
import { defineComponent } from 'vue';
import { UserIcon, ClockIcon, SortAscendingIcon, SortDescendingIcon } from '@heroicons/vue/solid'
import ConversationComponent from '../components/Conversation.vue'

export default defineComponent({
  name: "SkypeExportParser",
  components: { UserIcon, ClockIcon, ConversationComponent, SortAscendingIcon, SortDescendingIcon },
  computed: {
    conversationId() { return this.$route.params.id; },
    userId() { return this.$store.state.userId; },
    exportDate() { return this.$store.state.exportDate; },
    // TODO can maybe some option in some kind of settings, if they should be shown or not
    conversations(): Conversation[] { return this.$store.state.conversations.filter(element => element.MessageList.length > 0 && !element.id.endsWith('@cast.skype') && !element.id.endsWith('calllogs') && !element.id.endsWith('@thread.skype') && !element.id.endsWith('@encrypted.skype')); },
    conversationById(): Conversation | undefined { return this.$store.state.conversations.find(element => element.id == this.$route.params.id); },
  },
  methods: {
    dateToLocal(date: string) { return new Date(date).toLocaleString(); },
    getMessageContent(message: Message) {
      let content = '';
      if (message.messagetype == "Event/Call") content = "Anruf"
      if (message.messagetype == 'Text' || message.messagetype == 'RichText') content = message.content
      if (message.messagetype == 'RichText/UriObject') content = "Bild"

      return content;
    }
    /*
    loadSkypeUpload(event: any) {
      const files = event.target.files;

      if (files) {
        var reader = new FileReader();
        reader.readAsText(files[0], "UTF-8");

        // Handle progress, success, and errors
        reader.onprogress = this.updateProgress;
        reader.onload = this.loaded;
        reader.onerror = this.errorHandler;
      } else {
        console.log("No file uploaded");
      }
    },
    parseSkypeExport(content: SkypeExport) {
      this.$store.commit('setExport', content);
    },
    updateProgress(event: any) {
      console.log(event.lengthComputable);

      if (event.lengthComputable) {
        console.log(event.loaded);
        console.log(event.total);

        // evt.loaded and evt.total are ProgressEvent properties
        var loaded = event.loaded / event.total;
        if (loaded < 1) {
          // Increase the prog bar length
          // style.width = (loaded * 200) + "px";
        }
      }
    },
    loaded(event: any) {
      var fileString = event.target.result;
      return this.$store.commit('setExport', JSON.parse(fileString));
    },
    errorHandler(event: any) {
      console.log("Error Handler:");
      console.log(event.target.error.name);
    }
    */
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
</style>
