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
      filelist: undefined,
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
  actions: {
    async loadDemoData({commit}) {
      if (import.meta.env.PROD) return; // in case the application is in production
      if (!import.meta.env.VITE_DEMO_FOLDER) { // in case the demo folder is not set
        console.log('ENV "VITE_DEMO_FOLDER" is not set!')
        return;
      }
      const runtimeConfig: any = await fetch(`${import.meta.env.VITE_DEMO_FOLDER}/messages.json`);
      commit('setExport', await runtimeConfig.json());
    }
  },
  getters: {}
})
