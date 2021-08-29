<template>
  <div v-if="call && call.type == 'ended'">Anruf Beendet {{ callDuration ? ` ${callDuration} Sekunden` : '' }}</div>
  <div v-else-if="call && call.type == 'started'">Anruf Gestartet</div>
  <div v-else-if="message.messagetype == 'Text' || message.messagetype == 'RichText'" v-bind:class="{ 'text-right': message.from == userId, 'text-left': message.from != userId }">
    <div v-if="quote">{{ quote.content.replaceAll('<', '') }}</div>
    {{ message.content }}<span v-if="em"> (edited)</span>
  </div>
  <div v-else>{{ message.id }}</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EM, LegacyQuote, Message, Partlist, Quote } from '@/types/SkypeExport'

export default defineComponent({
  name: 'Message',
  props: {
    message: { type: Object as PropType<Message>, required: true }, // https://philipdevblog.hashnode.dev/vue-3-typescript-props-with-types
    userId: { type: String, required: true }
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
    },
    parseQuoteContent(xml: string) {
      const xmlRoot = this.getXMLRoot(xml);
      if (xmlRoot.getElementsByTagName('quote').length > 0) {
        const xmlQuote = xmlRoot.getElementsByTagName('quote')[0];

        const legecyQuotes: LegacyQuote[] = []
        for (var j = 0; j < xmlQuote.getElementsByTagName('legacyquote').length; j++) {
          legecyQuotes.push({ content: xmlQuote.getElementsByTagName('legacyquote')[j].textContent })
        }

        return {
          author: xmlQuote.getAttribute('author'),
          authorname: xmlQuote.getAttribute('authorname'),
          timestamp: xmlQuote.getAttribute('timestamp'),
          conversation: xmlQuote.getAttribute('conversation'),
          messageid: xmlQuote.getAttribute('messageid'),
          cuid: xmlQuote.getAttribute('cuid'),
          legacyquote: legecyQuotes,
          content: xmlQuote.textContent
        }

      } else return undefined
    },
    parseEM(xml: string) {
      const xmlRoot = this.getXMLRoot(xml);
      if (xmlRoot.getElementsByTagName('e_m').length > 0) {
        const xmlEM = xmlRoot.getElementsByTagName('e_m')[0];

        return {
          a: xmlEM.getAttribute('a'),
          ts_ms: xmlEM.getAttribute('a'),
          ts: xmlEM.getAttribute('a'),
          t: xmlEM.getAttribute('a')
        }
      } else return undefined
    }
  },
  mounted() {
    if (this.message.messagetype == 'Event/Call') { this.call = this.parseCallContent(this.message.content); }
    if (this.message.messagetype == 'Text' || this.message.messagetype == 'RichText') {
      this.quote = this.parseQuoteContent(this.message.content);
      this.em = this.parseEM(this.message.content);

      this.message.content = this.message.content.replace(/<quote((.|\s)*)<\/quote>/g, '').replace(/<e_m(.*)<\/e_m>/g, '').replace('\n', ' ').trim()
    }
  },
})
</script>

<style scoped>

</style>
