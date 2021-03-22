import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCookie from 'vue-cookie'
import { WSD_LOCAL_LANGUAGE } from '@/config/cookies'

Vue.use(VueI18n)

const languages = []
const messages = {}

const messageNames = require.context('./language', false, /\.js$/)
messageNames.keys().forEach(key => {
  const message = messageNames(key).default
  const name = key.match(/\.\/(.*)(\.js)/)[1]
  languages.push(name)
  messages[name] = message
})

const localLanguage = VueCookie.get(WSD_LOCAL_LANGUAGE) || 'zh-cn'

const i18n = new VueI18n({
  messages,
  locale: localLanguage
})

export const LOCAL_LANGUAGES = languages

export default i18n
