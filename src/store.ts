import { State } from 'vue'
import { createStore } from 'vuex'
import { SkypeParser } from './classes/SkypeParser'
import { SkypeExport } from './types/SkypeExport'

// Create a new store instance.
export default createStore({
  state () {
    return {
      raw: undefined,
      fileList: [],
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
    setExport (state: State, skype: SkypeExport) {
      state.raw = skype
      state.userId = skype.userId
      state.exportDate = skype.exportDate

      // filter everything out and parse all the messages
      const parser = new SkypeParser();
      const conversationNew = skype.conversations.filter(element => element.MessageList.length > 0 && !state.conversationFilter.some(filter => element.id.endsWith(filter)));
      for (const conversation of conversationNew) {
        conversation.parsed = false;
        conversation.MessageList = conversation.MessageList.filter(element => state.messageTypesFilter.some(type => type == element.messagetype) ).map(element => parser.parseMessage(element, state.fileList)).reverse();
      }

      state.conversations = conversationNew.filter(element => element.MessageList.length > 0);
    },
    async setFileList(state: State, fileList: FileList) {

      state.fileList = new Array();
      for(let i = 0; i < fileList.length; i++) {
        // easy way to get a in the dom viewable image: https://stackoverflow.com/questions/40348570/uncaught-domexception-failed-to-execute-readasdataurl-on-filereader-the-ob#40364478
        state.fileList.push({ name: fileList[i].name, blob: URL.createObjectURL(fileList[i]), type: fileList[i].type })
      }
    },
    clearData(state: State) {
      state.raw = undefined;
      state.fileList = [];
      state.userId = undefined;
      state.exportDate = undefined;
      state.conversations = [];
      state.conversationLoading = { loading: false, status: 0 };
    }
  },
  getters: {}
})
