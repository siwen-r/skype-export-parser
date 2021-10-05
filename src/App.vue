<template>
  <header class="flex justify-between p-5">
    <div class="flex justify-start">
      <router-link to="/" class="text-3xl font-black pl-2"><span class="skype">Skype</span> Export Parser</router-link>
    </div>
    <div v-if="isConversation" class="flex justify-end">
      <div v-if="user" class="font-black self-center pr-2">{{ user }}</div>
      <UserIcon v-if="user" class="h-7 w-7 self-center" />
    </div>
  </header>
  <div v-if="isConversation"><router-view></router-view></div>
  <div v-else>
    <input type="file" id="filepicker" name="fileList" webkitdirectory multiple @change="loadData"/>
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
    files() { return this.$store.state.filelist }
  },
  methods: {
    async loadDemoData() {
      if (!this.isConversation) {
        const runtimeConfig: any = await fetch("/demo/messages.json");
        this.$store.commit('setExport', await runtimeConfig.json());
      }
    },
    loadData(event: any) {
      const files: FileList = event.target.files;

      for (let i=0; i<files.length; i++) { if (files[i].name === 'messages.json') this.loadFile(files[i]); }

      this.$store.state.filelist = files;
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
    // this.loadDemoData();
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
</style>
