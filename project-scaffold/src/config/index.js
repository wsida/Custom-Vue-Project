// 基础配置
/**
 * 菜单栏配置
 * title 菜单标题
 * icon 菜单图标
 * iconClass 菜单自定义图标类
 * permitCode 菜单权限码
 * disabled 禁用菜单
 * children 子菜单
 */
export const GLOBAL_MENUS = (self) => ([
  {
    title: self.$t('menu.dashboard'),
    icon: 'dashboard', // iconClass 自定义图表类
    path: '/dashboard',
    permitCode: 'menu:dashboard'
  }, {
    title: self.$t('menu.workspace'),
    icon: 'appstore', // iconClass 自定义图表类
    path: '/workspace',
    permitCode: 'menu:workspace'
  }, {
    title: self.$t('menu.form'),
    icon: 'profile',
    path: '/form',
    permitCode: 'menu:form',
    children: [
      {
        title: self.$t('menu.basicForm'),
        path: '/form-basic',
        permitCode: 'menu:form-basic'
      }, {
        title: self.$t('menu.complexForm'),
        path: '/form-complex',
        permitCode: 'menu:form-complex'
      }
    ]
  }, {
    title: self.$t('menu.table'),
    icon: 'table',
    path: '/table',
    permitCode: 'menu:table',
    children: [
      {
        title: self.$t('menu.basicTable'),
        path: '/table-basic',
        permitCode: 'menu:table-basic'
      }, {
        title: self.$t('menu.complexTable'),
        path: '/table-complex',
        permitCode: 'menu:table-complex'
      }
    ]
  }, {
    title: self.$t('menu.list'),
    icon: 'unordered-list',
    path: '/list',
    permitCode: 'menu:list',
    children: [
      {
        title: self.$t('menu.basicList'),
        path: '/list-basic',
        permitCode: 'menu:list-basic'
      }, {
        title: self.$t('menu.infiniteScrollList'),
        path: '/list-infinite-scroll',
        permitCode: 'menu:list-infinite-scroll'
      }
    ]
  }
])

export function getPermitMenus (self, permits = []) {
  const menuLoop = (menus) => {
    const _menus = menus.map(menu => {
      const _menu = { ...menu }
      if (_menu.children && _menu.children.length) {
        _menu.children = menuLoop(_menu.children)
      }
      return _menu
    })
    return _menus.filter(menu => !menu.permitCode || permits.includes(menu.permitCode))
  }
  return menuLoop(GLOBAL_MENUS(self))
}
