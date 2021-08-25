<template>
  [{{ message.originalarrivaltime }}] {{ message.from }}: {{ message.content }} ({{ message.messagetype }})
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Message } from '@/types/SkypeExport'

export default defineComponent({
  name: 'Message',
  props: {
    message: { type: Object as PropType<Message>, required: true } // https://philipdevblog.hashnode.dev/vue-3-typescript-props-with-types
  }
})
</script>

<style scoped>

</style>
