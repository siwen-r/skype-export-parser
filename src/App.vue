<template>
  <header class="flex justify-between p-5">
    <div class="flex justify-start items-end font-black text-3xl">
      <router-link to="/"><span class="skype">Skype</span> Export Parser</router-link>
      <span v-if="!production" class="text-red-700 rounded-b-lg pl-2">DEV MODE</span>
    </div>
    <div v-if="isConversation" class="flex items-end">
      Parse different Skype Export:
      <input type="file" id="filepicker" name="fileList" class="pl-2" webkitdirectory multiple @change="loadData"/>
    </div>
    <div v-if="isConversation" class="flex justify-end">
      <div v-if="user" class="font-black self-center pr-2">{{ user }}</div>
      <UserIcon v-if="user" class="h-7 w-7 self-center" />
    </div>
  </header>
  <div v-if="isConversation"><router-view></router-view></div>
  <div v-else class="flex justify-center text-left">
    <div class="flex flex-col pt-10">
      <div class="text-2xl skype font-black">Instruction to get the Skype Export</div>
      <ul class="list-inside list-decimal mt-2">
        <li>Sign in with your Microsoft / Skype Account under the <a href="https://go.skype.com/export" target="_blank" class="skype">Skype Export Page</a></li>
        <li>
          Choose Export Option wich fit your preferences
          <ul class="list-inside list-disc pl-5">
            <li>Conversation: Contains all messages and conversation</li>
            <li>Files: Contains files, pictures, videos, video messages, voice mail, and call recordings</li>
          </ul>
        </li>
        <li>Supmit the request</li>
        <li>Wait till the Export is finish processed by Microsoft (might take some time, depending on the amount of data)</li>
        <li class="disclousre-marker pt-5">Continue when the Export is finished:</li>
        <li>Download the Export</li>
        <li>Extract all files into a new folder</li>
        <li>click Choose Files, choose the folder and click upload when asked, to start the parsing of the skype export</li>
      </ul>
      <div class="flex justify-center">
        <div class="flex items-end mt-10">
          <span class="font-black skype">Parse Skype Export:</span>
          <input type="file" id="filepicker" name="fileList" class="pl-2" webkitdirectory multiple @change="loadData"/>
        </div>
      </div>
      <div class="pt-4"><span class="font-black text-red-700">Notice</span>: At no time messages or other media data will be send to a server. Every processing will be done inside your Browser localy.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserIcon } from '@heroicons/vue/solid'

export default defineComponent({
  name: 'App',
  components: { UserIcon },
  computed: {
    isConversation() { return this.$store.state.conversations.length > 0 },
    user() { return this.$store.state.userId; },
    production() { return import.meta.env.PROD },
  },
  methods: {
    async loadData(event: any) {
      const files: FileList = event.target.files;

      await this.$store.commit('setFileList', files); // needs to be executed before loadFile
      for (let i=0; i<files.length; i++) {  if (files[i].name === 'messages.json') this.loadFile(files[i]); }
    },
    loadFile(file: File) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      // Handle progress, success, and errors
      reader.onprogress = this.updateProgress;
      reader.onload = (event: any) => { return this.$store.commit('setExport', JSON.parse(event.target.result)); }
      reader.onerror = (event: any) => { console.log(event.target.error.name); }
    },
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
  },
  mounted() {
    this.$store.dispatch('loadDemoData')
  }
})
</script>

<style>
@font-face {
  font-family: 'Roboto Slab';
  font-style: normal;
  font-weight: 400;
  src: url('./fonts/roboto-slab-v13-latin-regular.eot'); /* IE9 Compat Modes */
  src: local(''),
       url('./fonts/roboto-slab-v13-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('./fonts/roboto-slab-v13-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
       url('./fonts/roboto-slab-v13-latin-regular.woff') format('woff'), /* Modern Browsers */
       url('./fonts/roboto-slab-v13-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
       url('./fonts/roboto-slab-v13-latin-regular.svg#RobotoSlab') format('svg'); /* Legacy iOS */
}

#app {
  height: 100%;
}

.skype {
  color: #00AFF0;
}

.skype-background {
  background-color: #00AFF0;
}

ul li {
  padding-left: 5px;
  padding-top: 5px;
}

ul li::marker {
  color: #00AFF0;
  font-weight: bold;
}

.disclousre-marker {
  list-style-type: disclosure-open;
}
</style>
