<template>
  <a-layout class="wsd-basic-layout">
    <a-layout-header class="wsd-basic-header">
      <global-header></global-header>
    </a-layout-header>
    <a-layout class="wsd-basic-layout--inner">
      <a-layout-sider
        class="wsd-basic-sider"
        :collapsedWidth="64"
        :collapsed="collapsed"
        :trigger="null"
      >
        <global-sider></global-sider>
      </a-layout-sider>
      <a-layout-content class="wsd-basic-content">
        <transition name="slide-fade">
          <router-view></router-view>
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import GlobalHeader from './GlobalHeader'
import GlobalSider from './GlobalSider'
import { mapState } from 'vuex'
export default {
  name: 'BasicLayout',
  components: {
    GlobalHeader,
    GlobalSider
  },
  computed: {
    ...mapState(['collapsed'])
  }
}
</script>
