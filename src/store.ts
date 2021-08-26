import { State } from 'vue'
import { createStore } from 'vuex'
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
    }
  }
})
