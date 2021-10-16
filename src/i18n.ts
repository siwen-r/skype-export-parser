import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'

type MessageSchema = typeof enUS

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS
  }
})
