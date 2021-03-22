<!-- 登录/注册布局 -->
<template>
  <a-layout class="wsd-user-layout">
    <!-- 多语言切换 -->
    <a-dropdown
      :trigger="['click']"
      placement="topRight"
    >
      <span class="wsd-user-layout__language" :title="$t(`common.${lang}`)">
        {{$t(`common.${lang}`)}}
      </span>
      <a-menu slot="overlay">
        <template v-for="lang in languages">
          <a-menu-item :key="lang" :command="lang">
            <a href="javascript:;" @click="handleChangeLanguage(lang)">{{$t(`common.${lang}`)}}</a>
          </a-menu-item>
        </template>
      </a-menu>
    </a-dropdown>
    <a-layout class="wsd-user-layout__bg">
      <a-layout-content>
        <router-view name="bg"></router-view>
      </a-layout-content>
    </a-layout>
    <a-layout class="wsd-user-layout__content">
      <a-layout-content >
        <transition name="slide">
          <router-view></router-view>
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { LOCAL_LANGUAGES } from '@/i18n'
import VueCookie from 'vue-cookie'
import { WSD_LOCAL_LANGUAGE } from '@/config/cookies'
export default {
  name: 'UserLayout',
  data () {
    return {
      lang: VueCookie.get(WSD_LOCAL_LANGUAGE) || 'zh-cn',
      languages: LOCAL_LANGUAGES
    }
  },
  methods: {
    // 切换语言
    handleChangeLanguage (lang) {
      if (lang !== this.lang) {
        // this.lang = lang
        // this.$i18n.local = lang
        VueCookie.set(WSD_LOCAL_LANGUAGE, lang)
        window && window.location.reload()
      }
    }
  }
}
</script>
