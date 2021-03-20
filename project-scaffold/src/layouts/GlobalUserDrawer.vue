<template>
  <div class="wsd-user-drawer__inner">
    <!-- 用户信息 -->
    <div class="wsd-user-drawer__header">
      <a-card class="wsd-user-drawer__info">
        <a-card-meta
          :border="false"
          :title="userInfo.username"
          :description="userInfo.description"
        >
          <template slot="avatar">
            <span class="wsd-user-drawer__avatarContent">
              <a-avatar
                :src="userInfo.avatar"
                :size="52"
                icon="user"
                class="wsd-user-drawer__avatar"
                @click="handleChangeAvatar"
              />
              <span class="wsd-user-drawer__avatarMask">
                {{$t('common.modifyAvatar')}}
              </span>
            </span>
          </template>
        </a-card-meta>
      </a-card>
      <div class="wsd-user-drawer__otherInfo">
        <!-- 手机 -->
        <div v-if="userInfo.telphone" class="wsd-user-drawer__otherInfoItem">
          <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.telphone')"><a-icon type="mobile" /></span>
          <span>{{userInfo.telphone}}</span>
        </div>
        <!-- 邮箱 -->
        <div v-if="userInfo.email" class="wsd-user-drawer__otherInfoItem">
          <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.email')"><a-icon type="mail" /></span>
          <span>{{userInfo.email}}</span>
        </div>
        <!-- 公司 -->
        <div v-if="userInfo.company" class="wsd-user-drawer__otherInfoItem">
          <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.company')"><a-icon type="bank" /></span>
          <span>{{userInfo.company}}</span>
        </div>
        <!-- 职位 -->
        <div v-if="userInfo.position" class="wsd-user-drawer__otherInfoItem">
          <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.position')"><a-icon type="user" /></span>
          <span>{{userInfo.position}}</span>
        </div>
        <!-- 地区 -->
        <div v-if="userInfo.region || userInfo.city" class="wsd-user-drawer__otherInfoItem">
          <span class="wsd-user-drawer__otherInfoItem--icon" :title="$t('common.region')"><a-icon type="environment" /></span>
          <span>{{userInfo.city ? userInfo.city + '-' : ''}}{{userInfo.region}}</span>
        </div>
      </div>
    </div>
    <!-- 主要内容 -->
    <div class="wsd-user-drawer__body">
      <div class="wsd-user-drawer__bodyChart is-blue-background">
      </div>
      <div class="wsd-user-drawer__bodyChart">
      </div>
      <div class="wsd-user-drawer__bodyRanking">
      </div>
    </div>
    <!-- 操作栏 -->
    <div class="wsd-user-drawer__footer">
      <a-button
        block
        type="danger"
        @click="handleExit"
      >退出登录</a-button>
    </div>
  </div>
</template>

<script>
import VueCookie from 'vue-cookie'
import { WSD_USER_TOKEN } from '@/config/cookies'
import { mapState } from 'vuex'
export default {
  name: 'GlobalUserDrawer',
  props: {
    visible: Boolean
  },

  data () {
    return {
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },

  methods: {
    // 修改头像
    handleChangeAvatar () {

    },

    // 退出登录
    handleExit () {
      VueCookie.delete(WSD_USER_TOKEN)
      window.location.reload()
    }
  }
}
</script>
