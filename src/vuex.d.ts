// vuex.d.ts
import { Store } from 'vuex'
import { Conversation, SkypeExport, Message, FileListEntity } from '@/types/SkypeExport'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    raw: SkypeExport | undefined
    fileList: FileListEntity[] | []
    userId: string | undefined
    exportDate: string | Date | undefined,
    conversations: Conversation[],
    conversationLoading: {
      loading: boolean,
      status: number
    },
    messageTypesFilter: string[],
    conversationFilter: string[]
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
    $refs: {
      [key: string]: HTMLElement|any,
    },

    limit: number
    page: number
    conversationMessageList: Message[]
    // app.vue
    isConversation: boolean
    loadDemoData: any

    loaded: any,
    updateProgress: any
    errorHandler: any
    loadFile(file: File): any

    // Home.vue
    messageList: Message[]
    imageList: Message[]
    conversation: Conversation | undefined
    conversations: Conversation[]
    gallery: boolean
    galleryItems: Message[];
    galleryPage: number;
    galleryInitial: boolean;
    messageItems: Message[]
    messageInitial: boolean;
    messagePage: number;

    getConversation(conversationId: string): any

    // Message.vue
    files: FileList | undefined
  }
}
