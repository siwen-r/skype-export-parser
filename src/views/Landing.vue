<template>
  <div class="mt-14">
    <div class="text-center">
      <div class="skype font-black text-3xl">{{ $t('project.name') }}</div>
      <div v-html="$t('project.catchphrase')"></div>
      <div class="mt-12">{{ $t('project.description') }}</div>
      <div class="mt-12">{{ $t('landing.upload.label') }} <input type="file" id="filepicker" name="fileList" class="pl-2" webkitdirectory multiple @change="loadData"/></div>
    </div>
    <div class="text-left mt-14">
      <ul v-if="!instruction" class="list-inside list-decimal mt-2">
        <li class="disclosure-marker-closed list-outside text-center cursor-pointer" @click="instruction = true">{{ $t('landing.instruction.header') }}</li>
      </ul>
      <ul v-else class="list-inside list-decimal mt-2">
        <li class="disclosure-marker-open list-outside text-center skype text-2xl font-bold cursor-pointer" @click="instruction = false">{{ $t('landing.instruction.header') }}</li>
        <li value="1" v-html="$t('landing.instruction.steps.1')"></li>
        <li>{{ $t('landing.instruction.steps.2') }}
          <ul class="list-inside list-disc pl-5">
            <li>{{ $t('landing.instruction.steps.2a') }}</li>
            <li>{{ $t('landing.instruction.steps.2b') }}</li>
          </ul>
        </li>
        <li>{{ $t('landing.instruction.steps.3') }}</li>
        <li>{{ $t('landing.instruction.steps.4') }}</li>
        <li class="disclosure-marker-open mt-5">{{ $t('landing.instruction.steps.5top') }}</li>
        <li value="5">{{ $t('landing.instruction.steps.5') }}</li>
        <li>{{ $t('landing.instruction.steps.6') }}</li>
        <li>{{ $t('landing.instruction.steps.7') }}</li>
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
