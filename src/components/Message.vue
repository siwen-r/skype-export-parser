<template>
  <div v-if="message.partlist && message.partlist.type == 'ended'">Anruf Beendet {{ callDuration ? ` ${callDuration} Sekunden` : '' }}</div>
  <div v-else-if="message.partlist && message.partlist.type == 'started'">Anruf Gestartet</div>
  <div v-else-if="message.partlist && message.partlist.type == 'missed'">Anruf verpasst</div>
  <div v-else-if="(message.messagetype == 'Text' || message.messagetype == 'RichText') && !isServerGenerated" v-bind:class="{ 'text-right': message.from == userId, 'text-left': message.from != userId }">
    <!--<div v-if="message.quote">{{ message.quote.content.replaceAll('<', '') }}</div>-->
    <span v-html="message.content"></span><span v-if="message.em"> (edited)</span>
    <div v-if="timestamp">{{ message.originalarrivaltime }}</div>
  </div>
  <!-- produces a big gap in the dom, could maybe done a level higher or the css needs to be on this level -->
  <div v-else-if="(message.messagetype == 'Text' || message.messagetype == 'RichText') && isServerGenerated"></div>
  <div v-else-if="message.messagetype == 'RichText/Media_AudioMsg'">
    Audiomessage
    <div v-if="message.amsreferences">{{ message.amsreferences }}</div>
  </div>
  <div v-else-if="message.messagetype == 'RichText/Media_GenericFile'">
    Generic File
    <div v-if="message.amsreferences">{{ message.amsreferences }}</div>
  </div>
  <div v-else-if="message.messagetype == 'RichText/UriObject'">
    URI Object
    <div v-if="message.amsreferences">
      <!-- will result in a long loading time -> needs to be lazy load or load when in viewport -->
      <div v-for="(item) in message.amsreferences" v-bind:key="item">
        <img :src="`http://localhost:3000/demo/media/${getImage(item, message.content)}`" alt="404 BILD NOT FOUND" style="max-width:200px;max-height:200px;" loading="lazy">
      </div>
    </div>
  </div>
  <div v-else-if="message.messagetype == 'RichText/Media_Video'">
    Video
    <div v-if="message.amsreferences">{{ message.amsreferences }}</div>
  </div>
  <div v-else-if="message.messagetype == 'RichText/Media_Album'">
    Album
    <div v-if="message.properties">{{ message.properties?.albumId }}</div>
    <div v-if="message.amsreferences">{{ message.amsreferences }}</div>
  </div>
  <div v-else-if="message.messagetype == 'RichText/Media_CallRecording'">
    Ton aufnahme
    <div v-if="message.amsreferences">{{ message.amsreferences }}</div>
  </div>
  <div v-else-if="message.messagetype == 'RichText/Media_FlikMsg'">File</div>
  <div v-else-if="message.messagetype == 'Poll'">Poll</div>
  <div v-else>MISSING: {{ message.id }} {{ message.messagetype }}</div>
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
      image: false
    }
  },
  computed: {
    // does not work because the
    callDuration() { return this.message.partlist?.part?.find(element => this.userId.endsWith(element?.identity || ''))?.duration || undefined }, // Their might be a prefix in the userId
    isServerGenerated() { return this.message.properties?.isserversidegenerated === 'True' || false }
  },
  methods: {
    getImage(imageId: string, content: any) {
      if (content.includes('Picture')) {
        const ret = /png|gif|jpe?g|heic|tiff?|bmp|eps|raw/i;
        const type = content.match(ret) || [];

        imageId += '.1'
        return imageId + ((type.size === 0 || type === '' || type[0] === undefined) ? '' : `.${type[0]}`)
      }
    }
  }
})
</script>

<style scoped>

</style>
