<template>
  <input id="skype-upload" type="file" ref="skypeImport" @change="loadSkypeUpload" />
  <br>
  <div>userId: {{ userId }}</div>
  <div>exportDate: {{ exportDate }}</div>
  <hr/>
  <div>Metics</div>
  <div>MessageTypes: {{ messagetypes }}</div>
  <div>ConversationPartners: {{ conversationPartners }}</div>
  <hr/>
  <div>Conversations</div>
  <div v-for="con in conversations" v-bind:key="con.id">
    <router-link :to="`/conversation/${con.id}`"><div class="font-black">{{ con.displayName }} ({{ con.id }})</div></router-link>
    <!--<div v-for="message in con.MessageList" v-bind:key="message.id"><Message :message="message"></Message></div>-->
  </div>
</template>

<script lang="ts">
import { Conversation, SkypeExport } from '@/types/SkypeExport';
import { defineComponent } from 'vue';
import Message from "../components/Message.vue"

export default defineComponent({
  name: "SkypeExportParser",
  components: {
    Message
  },
  computed: {
    userId() { return this.$store.state.userId; },
    exportDate() { return this.$store.state.exportDate; },
    conversations(): Conversation[] { return this.$store.state.conversations; },
    messagetypes() {
      const set = new Set();
      for(const con of this.conversations) {
        for(const message of con.MessageList) {
          set.add(message.messagetype)
        }
      }

      return Array.from(set)
    },
    conversationPartners() {
      const set = new Set();
      for(const con of this.conversations) {
        set.add(con.displayName)
      }

      return Array.from(set)
    }
  },
  methods: {
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
      return this.parseSkypeExport(JSON.parse(fileString));
    },
    errorHandler(event: any) {
      console.log("Error Handler:");
      console.log(event.target.error.name);
    },
    async loadDemoData() {
      const runtimeConfig: any = await fetch("/messages.json");
      this.parseSkypeExport(await runtimeConfig.json());
    },
  },
  mounted () {
    this.loadDemoData()
  }
});
</script>

<style scoped>
* {
  text-align: left;
}
</style>
