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
      state.conversations.forEach(element => element.parsed = false);

      // parse everything in better format
      //const parser = new SkypeParser();
      //state.conversations = state.conversations.map(element => parser.parseConversation(element));
    },
    parseConversation(state, id: string) {
      const parser = new SkypeParser();

      const index = state.conversations.findIndex((element) => element.id == id);
      if(index >= 0 && !state.conversations[index].parsed) {
        state.conversations[index].MessageList = state.conversations[index].MessageList.map(element => parser.parseMessage(element))
        state.conversations[index].parsed = true
      }
    }
  }
})
