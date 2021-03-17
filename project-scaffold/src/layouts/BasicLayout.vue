<template>
  <a-layout class="wsd-basic-layout">
    <a-layout-header class="wsd-basic-header">
      <global-header></global-header>
    </a-layout-header>
    <a-layout class="wsd-basic-layout--inner">
      <a-layout-sider
        class="wsd-basic-sider"
        :collapsedWidth="48"
        :collapsed="collapsed"
        :trigger="null"
      >
        <global-sider
          :collapsed.sync="collapsed"
        ></global-sider>
      </a-layout-sider>
      <a-layout-content class="wsd-basic-content">
        <transition name="slide">
          <router-view></router-view>
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import GlobalHeader from './GlobalHeader'
import GlobalSider from './GlobalSider'
export default {
  name: 'BasicLayout',
  components: {
    GlobalHeader,
    GlobalSider
  },
  data () {
    return {
      collapsed: false
    }
  }
}
</script>
