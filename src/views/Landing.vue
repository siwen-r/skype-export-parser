<template>
  <div class="mt-14">
    <div class="text-center">
      <div class="skype font-black text-3xl">Skype Export Parser</div>
      <div>View your current and past <span class="skype font-black">Skype</span> conversations</div>
      <div class="mt-12">
        Skype Export Parser is a third party privacy focused website which enables you to view all conversation in your Skype Export.
        To view them you only need to provide and upload a Skype Export.
        The processing and storing of data will be done localy, in your Browser and no data will be send over the internet.
      </div>
      <div class="mt-12">Upload Skype Export: <input type="file" id="filepicker" name="fileList" class="pl-2" webkitdirectory multiple @change="loadData"/></div>
    </div>
    <div class="text-left mt-14">
      <ul v-if="!instruction" class="list-inside list-decimal mt-2">
        <li class="disclosure-marker-closed list-outside text-center cursor-pointer" @click="instruction = true">Instruction</li>
      </ul>
      <ul v-else class="list-inside list-decimal mt-2">
        <li class="disclosure-marker-open list-outside text-center skype text-2xl font-bold cursor-pointer" @click="instruction = false">Instruction</li>
        <li value="1">Sign in with your Microsoft / Skype Account under the <a href="https://go.skype.com/export" target="_blank" class="skype">Skype Export Page</a></li>
        <li>
          Choose Export Option wich fit your preferences
          <ul class="list-inside list-disc pl-5">
            <li>Conversation: Contains all messages and conversation</li>
            <li>Files: Contains files, pictures, videos, video messages, voice mail, and call recordings</li>
          </ul>
        </li>
        <li>Supmit the request</li>
        <li>Wait till the Export is finish processed by Microsoft (might take some time, depending on the amount of data)</li>
        <li class="disclosure-marker-open mt-5">Continue when the Export is finished:</li>
        <li value="5">Download the Export</li>
        <li>Extract all files into a new folder</li>
        <li>click Choose Files, choose the folder and click upload when asked, to start the parsing of the skype export</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "SkypeExportParser",
  components: {  },
  data() {
    return {
      instruction: false
    }
  },
  computed: {},
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
});
</script>

<style scoped>
ul li {
  padding-left: 5px;
  padding-top: 5px;
}

ul li::marker {
  color: #00AFF0;
  font-weight: bold;
}

.disclosure-marker-closed {
  list-style-type: disclosure-closed;
}

.disclosure-marker-open {
  list-style-type: disclosure-open;
}
</style>
