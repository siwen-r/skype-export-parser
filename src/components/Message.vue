<template>
  <div class="pt-1 pb-1">
    <!-- calls -->
    <div v-if="message.messagetype == 'Event/Call'" class="text-center">
      <div class="text-gray-300 dark:text-gray-700">{{ dateToLocal(message.originalarrivaltime) }}</div>
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
        <div class="text-gray-300 dark:text-gray-700">
          <span>{{ message.from }}</span>
          <span v-if="message.originalarrivaltime"> at {{ dateToLocal(message.originalarrivaltime) }}</span>
        </div>
      </div>
    </div>

    <!-- URI Objects e.g. Images -->
    <div v-else-if="message.messagetype == 'RichText/UriObject'" class="flex" v-bind:class="{ 'text-right': message.from == userId, 'justify-end': message.from == userId, 'text-left': message.from != userId, 'justify-start': message.from != userId }">
      <div class="flex flex-col w-full">
        <div v-if="message.images" class="flex space-x-2" v-bind:class="{ 'justify-end': message.from == userId, 'justify-start': message.from != userId }">
          <img v-for="(item, index) in message.images" v-bind:key="index" :imagename="`${item.name}`" :src="item.blob" alt="404 BILD NOT FOUND" style="max-width:200px;max-height:200px;" loading="lazy" class="rounded shadow-inner">
        </div>
        <div class="text-gray-300 dark:text-gray-700">
          <span>{{ message.from }}</span>
          <span v-if="message.originalarrivaltime"> at {{ dateToLocal(message.originalarrivaltime) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Message } from '@/types/SkypeExport';
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Message',
  props: {
    // index: { type: Number, required: true },
    message: { type: Object as PropType<Message>, required: true }, // https://philipdevblog.hashnode.dev/vue-3-typescript-props-with-types
    userId: { type: String, required: true },
    timestamp: { type: Boolean, default: false }
  },
  computed: {
    // does not work because the
    callDuration(): any { return this.message.partlist?.part?.find(element => this.userId.endsWith(element?.identity || ''))?.duration || undefined }, // Their might be a prefix in the userId
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
  }
})
</script>

<style scoped>

</style>
