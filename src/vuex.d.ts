// vuex.d.ts
import { Store } from 'vuex'
import { Conversation, SkypeExport, Message } from '@/types/SkypeExport'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    count: number,

    raw: SkypeExport | undefined
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

    // Home.vue
    conversation: Conversation | undefined
    conversations: Conversation[]
    getConversation(conversationId: string): any
  }
}
