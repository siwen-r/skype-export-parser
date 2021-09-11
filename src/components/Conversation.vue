<template>
  <div>{{ id }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Conversation',
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {}
})
</script>

<style scoped>

</style>
