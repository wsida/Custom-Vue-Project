<template>
  <a-layout class="wsd-user-layout">
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
  export default {
    name: 'UserLayout'
  }
</script>
