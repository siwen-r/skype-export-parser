<template>
    <div v-if="conversation">
    Conversation with {{ id }}
    <div id="conversation" >
      <div v-for="message in conversation.MessageList" v-bind:key="message.id" class="p-5">
        <Message :message="message" :userId="userId"></Message>

        <!--
        <div v-if="message.messagetype == 'Text' || message.messagetype == 'RichText'" class="flex-col">
          <div
          class="flex p-2 bg-white rounded-xl shadow-md"
          v-bind:class="{ 'justify-end': message.from == userId, 'justify-start': message.from != userId, 'text-right': message.from == userId, 'text-left': message.from != userId }">
            {{ message.content }}<br>{{ message.id }}
          </div>
          -->
          <!--<div>{{ message.id }}</div>-->
          <!--
        </div>
        <div v-else-if="message.messagetype == 'Event/Call'" class="text-center">
          {{ xml = parseCallContent(message.content) }}
          <span v-if="xml.type == 'started'">Anruf begonnen</span>
          <span v-else-if="xml.type == 'ended'">Anruf beendet</span>
          <span v-else>Anruf<br>{{ xml }}</span>
          <br>
        </div>
        <div v-else>{{ message.messagetype }} </div>
        -->
        <!--
        <div v-if="message.from == userId" class="text-right">{{ message.content }}</div>
        <div v-else class="text-left">{{ message.content }}</div>
        -->
      </div>
    </div>

    <!--<div v-for="message in conversation.MessageList" v-bind:key="message.id"><Message :message="message"></Message></div>-->
  </div>
</template>

<script lang="ts">
import { Conversation } from '@/types/SkypeExport';
import { defineComponent } from 'vue'
import Message from "../components/Message.vue"
import { SkypeContentOptions } from '../types/SkypeContentOptions'

export default defineComponent({
  name: 'SkypeConversation',
  components: {
    Message
  },
  computed: {
    id() { return this.$route.params.id; },
    conversation(): Conversation | undefined { return this.$store.state.conversations.find(element => element.id == this.$route.params.id); },
    userId() { return this.$store.state.userId; },
  },
  methods: {
    getXMLRoot(xml: string): HTMLElement {
      const parser = new DOMParser();
      const doc = parser.parseFromString( `<xml>${xml}</xml>`, "application/xml");

      return doc.documentElement;
    },
    parseXML(xml: string) {
      const parser = new DOMParser();
      const doc = parser.parseFromString( `<xml>${xml}</xml>`, "application/xml");

      const options: SkypeContentOptions = { partlist: undefined };

      // parts
      if (doc.documentElement.getElementsByTagName('partlist').length > 0) {
        const parts = [];
        for (var j = 0; j < doc.documentElement.getElementsByTagName('partlist')[0].getElementsByTagName('part').length; j++) {

          let duration = undefined
          if (doc.documentElement.getElementsByTagName('partlist')[0].getElementsByTagName('part')[j].getElementsByTagName('duration').length > 0)
            duration = doc.documentElement.getElementsByTagName('partlist')[0].getElementsByTagName('part')[j].getElementsByTagName('duration')[0].textContent

          var part = {
            identity: doc.documentElement.getElementsByTagName('partlist')[0].getElementsByTagName('part')[j].getAttribute('identity'),
            name: doc.documentElement.getElementsByTagName('partlist')[0].getElementsByTagName('part')[j].getElementsByTagName('name')[0].textContent,
            duration: duration
          }
          parts.push(part)
        }

        const partlist = {
          type: doc.documentElement.getElementsByTagName('partlist')[0].getAttribute('type') ,
          alt: doc.documentElement.getElementsByTagName('partlist')[0].getAttribute('alt'),
          callId: doc.documentElement.getElementsByTagName('partlist')[0].getAttribute('callId'),
          part: parts
        }
        options.partlist = partlist;
      }

      return options
    },
    parseCallContent(xml: string) {
      const xmlRoot = this.getXMLRoot(xml);
      const xmlPartlist = xmlRoot.getElementsByTagName('partlist')[0];

      const parts = [];
      for (var j = 0; j < xmlPartlist.getElementsByTagName('part').length; j++) {

        let duration = undefined
        if (xmlPartlist.getElementsByTagName('part')[j].getElementsByTagName('duration').length > 0)
          duration = xmlPartlist.getElementsByTagName('part')[j].getElementsByTagName('duration')[0].textContent

        var part = {
          identity: xmlPartlist.getElementsByTagName('part')[j].getAttribute('identity'),
          name: xmlPartlist.getElementsByTagName('part')[j].getElementsByTagName('name')[0].textContent,
          duration: duration
        }
        parts.push(part)
      }

      return { type: xmlPartlist.getAttribute('type'), alt: xmlPartlist.getAttribute('alt'), callId: xmlPartlist.getAttribute('callId'), part: parts };
    }
  }
})
</script>

<style scoped>
* {
  max-width: 1000px;
  margin: 0 auto;
}

#conversation {
  background-color: #eff8ff;
}
</style>
