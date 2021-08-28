<template>
  <div v-if="call && call.type == 'ended'">Anruf Beendet {{ callDuration ? ` ${callDuration} Sekunden` : '' }}</div>
  <div v-else-if="call && call.type == 'started'">Anruf Gestartet</div>
  <div v-else-if="message.messagetype == 'Text' || message.messagetype == 'RichText'" v-bind:class="{ 'text-right': message.from == userId, 'text-left': message.from != userId }">{{ message.content }}</div>
  <div v-else>{{ message.id }}</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Message, Partlist } from '@/types/SkypeExport'

export default defineComponent({
  name: 'Message',
  props: {
    message: { type: Object as PropType<Message>, required: true }, // https://philipdevblog.hashnode.dev/vue-3-typescript-props-with-types
    userId: { type: String, required: true }
  },
  data() {
    return {
      call: undefined as Partlist | undefined
    }
  },
  computed: {
    // does not work because the
    callDuration() { return this.call?.part?.find(element => this.userId.endsWith(element?.identity || ''))?.duration || undefined }, // Their might be a prefix in the userId
  },
  methods: {
    getXMLRoot(xml: string): HTMLElement {
      const parser = new DOMParser();
      const doc = parser.parseFromString( `<xml>${xml}</xml>`, "application/xml");

      return doc.documentElement;
    },
    parseCallContent(xml: string) {
      const xmlRoot = this.getXMLRoot(xml);
      const xmlPartlist = xmlRoot.getElementsByTagName('partlist')[0];

      const parts = [];
      for (var j = 0; j < xmlPartlist.getElementsByTagName('part').length; j++) {
        const xmlPart = xmlPartlist.getElementsByTagName('part')[j];

        let duration = undefined
        if (xmlPart.getElementsByTagName('duration').length > 0)
          duration = xmlPart.getElementsByTagName('duration')[0].textContent

        var part = {
          identity: xmlPart.getAttribute('identity'),
          name: xmlPart.getElementsByTagName('name')[0].textContent,
          duration: duration
        }
        parts.push(part)
      }

      return { type: xmlPartlist.getAttribute('type'), alt: xmlPartlist.getAttribute('alt'), callId: xmlPartlist.getAttribute('callId'), part: parts };
    }
  },
  mounted() {
    if (this.message.messagetype == 'Event/Call') { this.call = this.parseCallContent(this.message.content); }
  },
})
</script>

<style scoped>

</style>
