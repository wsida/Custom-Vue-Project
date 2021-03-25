<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enUS from 'ant-design-vue/lib/locale-provider/en_US'
import VueCookie from 'vue-cookie'
import { WSD_LOCAL_LANGUAGE } from '@/config/cookies'
export default {
  name: 'app',
  data () {
    return {
      lang: VueCookie.get(WSD_LOCAL_LANGUAGE) || 'zh-cn'
    }
  },
  computed: {
    locale () {
      return this.lang === 'zh-cn' ? zhCN : enUS
    }
  }
}
</script>
