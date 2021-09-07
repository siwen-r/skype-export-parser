<template>
  <div v-if="message.partlist && message.partlist.type == 'ended'">Anruf Beendet {{ callDuration ? ` ${callDuration} Sekunden` : '' }}</div>
  <div v-else-if="message.partlist && message.partlist.type == 'started'">Anruf Gestartet</div>
  <div v-else-if="(message.messagetype == 'Text' || message.messagetype == 'RichText') && !isServerGenerated" v-bind:class="{ 'text-right': message.from == userId, 'text-left': message.from != userId }">
    <!--<div v-if="message.quote">{{ message.quote.content.replaceAll('<', '') }}</div>-->
    <span v-html="message.content"></span><span v-if="message.em"> (edited)</span>
    <div v-if="timestamp">{{ message.originalarrivaltime }}</div>
  </div>
  <!-- produces a big gap in the dom, could maybe done a level higher or the css needs to be on this level -->
  <div v-else-if="(message.messagetype == 'Text' || message.messagetype == 'RichText') && isServerGenerated"></div>
  <div v-else>{{ message.id }}</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EM, Message, Partlist, Quote } from '@/types/SkypeExport'

export default defineComponent({
  name: 'Message',
  props: {
    message: { type: Object as PropType<Message>, required: true }, // https://philipdevblog.hashnode.dev/vue-3-typescript-props-with-types
    userId: { type: String, required: true },
    timestamp: { type: Boolean, default: false }
  },
  data() {
    return {
      call: undefined as Partlist | undefined,
      quote: undefined as Quote | undefined,
      em: undefined as EM | undefined
    }
  },
  computed: {
    // does not work because the
    callDuration() { return this.message.partlist?.part?.find(element => this.userId.endsWith(element?.identity || ''))?.duration || undefined }, // Their might be a prefix in the userId
    isServerGenerated() { return this.message.properties?.isserversidegenerated === 'True' || false }
  }
})
</script>

<style scoped>

</style>
