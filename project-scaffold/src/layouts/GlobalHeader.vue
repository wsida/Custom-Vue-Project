<template>
  <div class="wsd-header">
    <span class="wsd-header-left">
      <!-- 产品 -->
      <span class="wsd-header__product">
        <svg-icon icon-class="logo" class-name="wsd-header__logo"></svg-icon>
        <span class="wsd-header__title">
          WSD
        </span>
      </span>
    </span>
    <span class="wsd-header-right">
      <!-- 帮助中心 -->
      <span class="wsd-header__click" :title="$t('common.help')">
        <a-icon type="question-circle" />
      </span>
      <!-- 多语言切换 -->
      <a-dropdown
        :trigger="['click']"
      >
        <span class="wsd-header__click" :title="$t(`common.${lang}`)">
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
      <!-- 消息 -->
      <a-popover
        trigger="click"
        placement="bottomRight"
      >
        <span class="wsd-header__click" :title="$t('message.newMessage')">
          <a-badge :dot="messageList.length > 0">
            <a-icon type="bell" />
          </a-badge>
        </span>
        <template slot="content">
          <a-list :data-source="messageList" :loading="messageLoading" class="wsd-header-message">
            <a-list-item slot="renderItem" slot-scope="item">
              <div class="wsd-header-message__item" :key="item.id">
                <div class="wsd-header-message__time">{{ item.time }}</div>
                <div class="wsd-header-message__title">{{ item.title }}</div>
              </div>
            </a-list-item>
            <div slot="header" class="wsd-header-message__header">
              <span class="wsd-header-message__title">{{$t('message.newMessage')}}</span>
              <a href="javascript:void(0)" :disabled="!messageList.length">{{$t('common.detail')}}</a>
            </div>
            <div slot="footer" class="wsd-header-message__footer">
              <a href="javascript:void(0)" :disabled="!messageList.length" @click="handleAllRead">{{$t('message.allRead')}}</a>
            </div>
          </a-list>
        </template>
      </a-popover>
      <!-- 用户 -->
      <span class="wsd-header__click" @click="handleOpenUserDrawer">
        <span class="wsd-header_username">{{$t('common.hello')}}{{ userInfo.username }}</span>
        <a-avatar
          :size="36"
          :src="userInfo.avatar"
          icon="user"
        />
      </span>
      <!-- 用户抽屉 -->
      <a-drawer
        placement="right"
        wrapClassName="wsd-user-drawer"
        :closable="false"
        :width="320"
        :visible="userVisible"
        @close="handleCloseUserDrawer"
      >
        <global-user-drawer :visible.sync="userVisible"></global-user-drawer>
      </a-drawer>
    </span>
  </div>
</template>

<script>
// import logo from '@/assets/logo.png'
import GlobalUserDrawer from './GlobalUserDrawer'
import { LOCAL_LANGUAGES } from '@/i18n'
import VueCookie from 'vue-cookie'
import { WSD_LOCAL_LANGUAGE } from '@/config/cookies'

export default {
  name: 'GlobalHeader',
  components: {
    GlobalUserDrawer
  },
  data () {
    return {
      lang: VueCookie.get(WSD_LOCAL_LANGUAGE) || 'zh-cn',
      languages: LOCAL_LANGUAGES,
      // 用户详情弹窗
      userVisible: false,
      // 未读消息列表
      messageLoading: false,
      messageList: []
    }
  },

  computed: {
    userInfo () {
      return this.$store.state.user.userInfo || {}
    }
  },

  mounted () {
    this.getMessageList()
  },

  methods: {
    // 获取未读消息
    getMessageList () {
      const token = this.userInfo.token || ''
      this.messageLoading = true
      this.$api['message/unread']({ token }).then(res => {
        if (res.data && res.data.code === '0') {
          this.messageList = res.data.data
        } else {
          this.messageList.splice(0, this.messageList.length)
          this.$message.error(res.data.message || 'Error!')
        }
      }).finally(_ => {
        this.messageLoading = false
      })
    },

    // 全部已读
    handleAllRead () {
      const token = this.userInfo.token || ''
      this.$api['message/allread']({ token }).then(res => {
        if (res.data && res.data.code === '0') {
          this.getMessageList()
        } else {
          this.$message.error(res.data.message || 'Error!')
        }
      })
    },

    // 用户详情关闭
    handleCloseUserDrawer () {
      this.userVisible = false
    },

    // 打开用户详情
    handleOpenUserDrawer () {
      this.userVisible = true
    },

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
