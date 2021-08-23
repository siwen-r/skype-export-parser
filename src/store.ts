import { State } from 'vue'
import { createStore } from 'vuex'

// Create a new store instance.
export default createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state: State) {
      state.count++
    }
  }
})
