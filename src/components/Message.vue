<template>
  <div class="pt-1 pb-1">
    <!-- calls -->
    <div v-if="message.messagetype == 'Event/Call'" class="text-center">
      <div class="text-gray-300">{{ dateToLocal(message.originalarrivaltime) }}</div>
      <div v-if="message.partlist && message.partlist.type == 'ended'" class="font-bold">Anruf Beendet {{ callDuration ? ` ${convertCallDuration(callDuration)} Stunden` : '' }}</div>
      <div v-else-if="message.partlist && message.partlist.type == 'started'" class="font-bold">Anruf Gestartet</div>
      <div v-else-if="message.partlist && message.partlist.type == 'missed'" class="font-bold">Anruf verpasst</div>
      <div v-else> {{ message }} </div>
    </div>

    <!-- messages -->
    <div v-if="(message.messagetype == 'Text' || message.messagetype == 'RichText') && message.content != ''" class="flex" v-bind:class="{ 'text-right': message.from == userId, 'justify-end': message.from == userId, 'text-left': message.from != userId, 'justify-start': message.from != userId }">
      <div class="flex flex-col w-full">
        <div class="flex" v-bind:class="{ 'justify-end': message.from == userId, 'justify-start': message.from != userId }">
          <div class="skype-background rounded-t-lg p-5 max-w-1/2 text-left break-words" v-bind:class="{ 'rounded-l-lg': message.from == userId, 'rounded-r-lg': message.from != userId }">
            <span v-html="message.content"></span>
          </div>
        </div>
        <div class="text-gray-300">
          <span>{{ message.from }}</span>
          <span v-if="message.originalarrivaltime"> at {{ dateToLocal(message.originalarrivaltime) }}</span>
        </div>
      </div>
    </div>

    <!-- URI Objects e.g. Images -->
    <div v-else-if="message.messagetype == 'RichText/UriObject'" class="flex" v-bind:class="{ 'text-right': message.from == userId, 'justify-end': message.from == userId, 'text-left': message.from != userId, 'justify-start': message.from != userId }">
      <div class="flex flex-col w-full">
        <div v-if="message.amsreferences" class="flex" v-bind:class="{ 'justify-end': message.from == userId, 'justify-start': message.from != userId }">
          <img v-for="(item, imageIndex) in message.amsreferences" v-bind:key="imageIndex" :id="`image-${index}-${imageIndex}`" :imagename="`${item}.1`" :src="loadImage(`${item}.1`, `image-${index}-${imageIndex}`, message.content)" alt="404 BILD NOT FOUND" style="max-width:200px;max-height:200px;" loading="lazy" class="rounded shadow-inner" v-bind:class="{ 'pr-2': (message.from == userId && index != 0), 'pl-2': (message.from != userId && index != 0) }">
        </div>
        <div class="text-gray-300">
          <span>{{ message.from }}</span>
          <span v-if="message.originalarrivaltime"> at {{ dateToLocal(message.originalarrivaltime) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Message } from '@/types/SkypeExport'

export default defineComponent({
  name: 'Message',
  props: {
    index: { type: Number, required: true },
    message: { type: Object as PropType<Message>, required: true }, // https://philipdevblog.hashnode.dev/vue-3-typescript-props-with-types
    userId: { type: String, required: true },
    timestamp: { type: Boolean, default: false }
  },
  data() {
    return {
      image: false
    }
  },
  computed: {
    // does not work because the
    callDuration(): any { return this.message.partlist?.part?.find(element => this.userId.endsWith(element?.identity || ''))?.duration || undefined }, // Their might be a prefix in the userId
    isServerGenerated() { return this.message.properties?.isserversidegenerated === 'True' || false },
    files(): FileList | undefined { return this.$store.state.filelist }
  },
  methods: {
    dateToLocal(date: string) { return new Date(date).toLocaleString(); },
    convertCallDuration(seconds: string) {
      const parts = seconds.split('\.');
      if (parts.length != 2) return parts;

      const num = parseInt(seconds.split('\.')[0]);

      var hours = Math.floor(num / 3600);
      var minutes = num % 60;
      return hours + ":" + minutes;
    },
    // https://scotch.io/tutorials/use-the-html5-file-api-to-work-with-files-locally-in-the-browser
    loadImage(imageId: string, id: string, content: string) {
      if (!import.meta.env.PROD) return this.getImageURL(imageId, content)
      if (!this.files) return;

      // when the file is read it triggers the onload event above.
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].name.startsWith(imageId)) {

          // TODO maybe their is a shortcut? https://stackoverflow.com/questions/40348570/uncaught-domexception-failed-to-execute-readasdataurl-on-filereader-the-ob#40364478
          // generate a new FileReader object
          let reader = new FileReader();

          // inject an image with the src url
          reader.onload = ((event: any) => {

            let image = document.getElementById(id)
            //@ts-ignore
            if (image) image.src = event.target.result;

          })

          reader.readAsDataURL(this.files[i])
        }
      }
    },
    /**
     * Is used for development purpose, to pre load the data, which is provided by the server
     */
    getImageURL(imageId: string, content: any) {
      if (content.includes('Picture')) {
        const ret = /png|gif|jpe?g|heic|tiff?|bmp|eps|raw/i;
        const type = content.match(ret) || [];

        return "/demo/media/" + imageId + ((type.size === 0 || type === '' || type[0] === undefined) ? '' : `.${type[0]}`)
      }
    },
  }
})
</script>

<style scoped>

</style>
