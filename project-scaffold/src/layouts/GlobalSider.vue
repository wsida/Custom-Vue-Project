<template>
  <div>
    <div class="wsd-sider__menus">
      <a-menu
        style="width: 100%"
        mode="inline"
        :multiple="false"
        :openKeys="openKeys"
        :selectedKeys="selectedKeys"
        @click="handleMenuItemClick"
        @openChange="handleOpenKeysChange"
      >
        <!-- 菜单 -->
        <template v-for="menu in localMenu">
          <!-- 二级菜单 -->
          <template v-if="menu.children && menu.children.length">
            <a-sub-menu :key="menu.path" :disabled="menu.disabled">
              <span slot="title">
                <a-icon v-if="menu.icon" :type="menu.icon" />
                <i v-else-if="menu.iconClass" :class="menu.iconClass"></i>
                <span>{{menu.title}}</span>
              </span>
              <template v-for="subMenu in menu.children">
                <a-menu-item :key="subMenu.path" :disabled="subMenu.disabled">
                  <a-icon v-if="subMenu.icon" :type="subMenu.icon" />
                  <i v-else-if="subMenu.iconClass" :class="subMenu.iconClass"></i>
                  <span>{{ subMenu.title }}</span>
                </a-menu-item>
              </template>
            </a-sub-menu>
          </template>
          <!-- 一级菜单 -->
          <template v-else>
            <a-menu-item :key="menu.path" :disabled="menu.disabled">
              <a-icon v-if="menu.icon" :type="menu.icon" />
              <i v-else-if="menu.iconClass" :class="menu.iconClass"></i>
              <span>{{ menu.title }}</span>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </div>
    <div class="wsd-sider__collapse">
      <span @click="handleCollapseChange">
        <a-icon v-if="!collapsed" type="menu-fold" />
        <a-icon v-else type="menu-unfold" />
      </span>
    </div>
  </div>
</template>

<script>
import { getPermitMenus } from '@/config'
import { SET_COLLAPSED, SET_OPENKEYS, SET_SELECTEDKEYS } from '@/store/types'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'GlobalSider',

  data () {
    return {
      localMenu: []
    }
  },

  computed: {
    ...mapState({
      collapsed: (state) => state.collapsed,
      openKeys: (state) => state.openKeys,
      selectedKeys: (state) => state.selectedKeys,
      menus: (state) => state.user.menus
    }),

    ...mapGetters([
      'hasMenuPermit'
    ])
  },

  watch: {
    '$route.path' () {
      this.setOpenKeys()
      this.setSelectedKeys()
    },

    menus: {
      handler () {
        this.setLocalMenus()
        this.setOpenKeys()
        this.setSelectedKeys()
      },
      deep: true
    },

    collapsed (newVal) {
      if (newVal) {
        // 收缩
        this[SET_OPENKEYS]([])
      } else {
        this.setOpenKeys()
      }
    }
  },

  mounted () {
    this.setLocalMenus()
    this.setOpenKeys()
    this.setSelectedKeys()
  },

  methods: {
    ...mapMutations([SET_COLLAPSED, SET_OPENKEYS, SET_SELECTEDKEYS]),
    // 获取菜单
    setLocalMenus () {
      this.localMenu = getPermitMenus(this.$store.state.user.menus)
    },

    // 获取选择菜单
    setSelectedKeys () {
      this[SET_SELECTEDKEYS]([this.$route.meta && this.$route.meta.menu ? this.$route.meta.menu : this.$route.path])
    },

    // 获取submenu展开
    setOpenKeys () {
      const self = this
      let isFind = false
      const findLoop = (menus, parent) => {
        if (isFind) return
        menus.forEach(menu => {
          if (isFind) return
          if (menu.children && menu.children.length) {
            findLoop(menu.children, menu)
          }
          if ((this.$route.meta && this.$route.meta.menu === menu.path) || (menu.path === this.$route.path)) {
            isFind = true
            self[SET_OPENKEYS]([parent ? parent.path : this.$route.meta && this.$route.meta.menu ? this.$route.meta.menu : menu.path])
          }
        })
      }
      // 查找
      findLoop(this.localMenu)
    },

    // 点击菜单
    handleMenuItemClick ({ key }) {
      this[SET_SELECTEDKEYS]([key])
      this.$router.push(key)
    },

    // 展开submenu
    handleOpenKeysChange (keys) {
      /* 不控制 openSubKeys 直接添加.sync 修饰符，取消openChange 事件监听 */
      // this[SET_OPENKEYS](keys)
      /* 控制只展开一个submenu */
      if (keys.length) {
        const openSubKeys = keys.filter(key => !this.openKeys.includes(key))
        this[SET_OPENKEYS](openSubKeys)
      } else {
        this[SET_OPENKEYS](keys)
      }
    },

    // 收缩菜单
    handleCollapseChange () {
      this[SET_COLLAPSED](!this.collapsed)
    }
  }
}
</script>
