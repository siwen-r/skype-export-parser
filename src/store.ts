import { State } from 'vue'
import { createStore } from 'vuex'
import { SkypeParser } from './classes/SkypeParser'
import { SkypeExport } from './types/SkypeExport'

// Create a new store instance.
export default createStore({
  state () {
    return {
      count: 0,
      raw: undefined,
      userId: undefined,
      exportDate: undefined,
      conversations: [],
      skypeEmojis: [
        // https://support.skype.com/de/faq/FA12330/wie-sieht-die-vollstandige-liste-der-emoticons-aus

      ]
    }
  },
  mutations: {
    increment (state: State) {
      state.count++
    },
    setExport (state, skype: SkypeExport) {
      state.raw = skype
      state.userId = skype.userId
      state.exportDate = skype.exportDate
      state.conversations = skype.conversations

      for (const conversation of state.conversations) {
        conversation.parsed = false;
        conversation.MessageList.reverse();
      }

      // parse everything in better format
      //const parser = new SkypeParser();
      //state.conversations = state.conversations.map(element => parser.parseConversation(element));
    },
  },
  getters: {
    getMessages: (state, getters) => (conversationId: string) => {
      const conversation = state.conversations.find(element => element.id == conversationId)
      if (!conversation) return []
      if (conversation.parsed) return conversation.MessageList

      const parser = new SkypeParser();
      conversation.MessageList = conversation.MessageList.map(element => {
        if (element.parsed) return element
        const tmp = parser.parseMessage(element);
        tmp.parsed = true;

        return tmp;
      })

      conversation.parsed = true
      return conversation.MessageList;
    }
  }
})
