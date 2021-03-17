<template>
  <div>
    <div class="wsd-sider__menus">
      <a-menu
        style="width: 100%"
        mode="inline"
        :selectedKeys="selectedKeys"
        @click="handleMenuItemClick"
      >
        <!-- 菜单 -->
        <template v-for="menu in localMenu">
          <!-- 二级菜单 -->
          <template v-if="menu.children && menu.children.length">
            <a-sub-menu :key="menu.link" :disabled="menu.disabled">
              <span slot="title">
                <a-icon v-if="menu.icon" :type="menu.icon" />
                <i v-else-if="menu.iconClass" :class="menu.iconClass"></i>
                <span>{{menu.title}}</span>
              </span>
              <template v-for="subMenu in menu.children">
                <a-menu-item :key="subMenu.link" :disabled="subMenu.disabled">
                  <a-icon v-if="subMenu.icon" :type="subMenu.icon" />
                  <i v-else-if="subMenu.iconClass" :class="subMenu.iconClass"></i>
                  <span>{{ subMenu.title }}</span>
                </a-menu-item>
              </template>
            </a-sub-menu>
          </template>
          <!-- 一级菜单 -->
          <template v-else>
            <a-menu-item :key="menu.link" :disabled="menu.disabled">
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
import { GLOBAL_MENUS } from '@/config'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'GlobalSider',
  props: {
    collapsed: Boolean
  },
  computed: {
    localMenu () {
      const self = this
      const menuLoop = (menus) => {
        const _menus = menus.map(menu => {
          const _menu = { ...menu }
          if (_menu.children && _menu.children.length) {
            _menu.children = menuLoop(_menu.children)
          }
          return _menu
        })
        return _menus.filter(menu => !menu.permitCode || self.hasMenuPermit(menu.permitCode))
      }
      return menuLoop(GLOBAL_MENUS)
    },

    selectedKeys () {
      return [this.$route.path]
    },
    ...mapState([
      'menus'
    ], 'user'),

    ...mapGetters([
      'hasMenuPermit'
    ], 'user')
  },

  methods: {
    // 点击菜单
    handleMenuItemClick ({ key }) {
      this.$router.push(key)
    },

    // 收缩菜单
    handleCollapseChange () {
      this.$emit('update:collapsed', !this.collapsed)
    }
  }
}
</script>
