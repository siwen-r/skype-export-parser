// vuex.d.ts
import { Store } from 'vuex'
import { Conversation, SkypeExport } from '@/types/SkypeExport'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    count: number,

    raw: SkypeExport | undefined
    userId: string | undefined
    exportDate: string | Date | undefined,
    conversations: Conversation[]
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
