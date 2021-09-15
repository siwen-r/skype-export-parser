<template>
  <div class="pt-2 pb-2">
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
          <div class="skype-background rounded-t-lg p-5 max-w-1/2" v-bind:class="{ 'rounded-l-lg': message.from == userId, 'rounded-r-lg': message.from != userId }">
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
          <!-- will result in a long loading time -> needs to be lazy load or load when in viewport -->
          <img v-for="(item, index) in message.amsreferences" v-bind:key="index" :src="`http://localhost:3000/demo/media/${getImage(item, message.content)}`" alt="404 BILD NOT FOUND" style="max-width:200px;max-height:200px;" loading="lazy" class="rounded shadow-inner" v-bind:class="{ 'pr-2': (message.from == userId && index != 0), 'pl-2': (message.from != userId && index != 0) }">
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
    callDuration() { return this.message.partlist?.part?.find(element => this.userId.endsWith(element?.identity || ''))?.duration || undefined }, // Their might be a prefix in the userId
    isServerGenerated() { return this.message.properties?.isserversidegenerated === 'True' || false }
  },
  methods: {
    dateToLocal(date: string) { return new Date(date).toLocaleString(); },
    getImage(imageId: string, content: any) {
      if (content.includes('Picture')) {
        const ret = /png|gif|jpe?g|heic|tiff?|bmp|eps|raw/i;
        const type = content.match(ret) || [];

        imageId += '.1'
        return imageId + ((type.size === 0 || type === '' || type[0] === undefined) ? '' : `.${type[0]}`)
      }
    },
    convertCallDuration(seconds: string) {
      const parts = seconds.split('\.');
      if (parts.length != 2) return parts;

      const num = parseInt(seconds.split('\.')[0]);

      var hours = Math.floor(num / 3600);
      var minutes = num % 60;
      return hours + ":" + minutes;
    }
  }
})
</script>

<style scoped>

</style>
