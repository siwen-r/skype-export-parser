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
      conversationLoading: {
        loading: false,
        status: 0
      },
      messageTypesFilter: [ 'Event/Call', 'RichText/UriObject', 'Text', 'RichText' ],
      conversationFilter: [ '@cast.skype', 'calllogs', '@thread.skype', '@encrypted.skype' ]
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

      // filter everything out and parse all the messages
      const parser = new SkypeParser();
      const conversationNew = skype.conversations.filter(element => element.MessageList.length > 0 && !state.conversationFilter.some(filter => element.id.endsWith(filter)));
      for (const conversation of conversationNew) {
        conversation.parsed = false;
        conversation.MessageList = conversation.MessageList.filter(element => state.messageTypesFilter.some(type => type == element.messagetype) ).map(element => parser.parseMessage(element)).reverse();
      }

      state.conversations = conversationNew.filter(element => element.MessageList.length > 0);
    },
  },
  getters: {}
})
