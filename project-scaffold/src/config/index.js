// 基础配置

// 是否开启验证 permitCode
export const PERMIT_ROUTE_OPEN = true
export const PERMIT_MENU_OPEN = true
export const PERMIT_FUNC_OPEN = false
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
        title: self.$t('menu.stepForm'),
        path: '/form-step',
        permitCode: 'menu:form-step'
      }, {
        title: self.$t('menu.complexForm'),
        path: '/form-complex',
        permitCode: 'menu:form-complex'
      }
    ]
  }, {
    title: self.$t('menu.list'),
    icon: 'table',
    path: '/list',
    permitCode: 'menu:list',
    children: [
      {
        title: self.$t('menu.searchList'),
        path: '/list-search',
        permitCode: 'menu:list-search'
      }, {
        title: self.$t('menu.searchTable'),
        path: '/table-search',
        permitCode: 'menu:table-search'
      }, {
        title: self.$t('menu.infiniteScrollList'),
        path: '/list-infinite-scroll',
        permitCode: 'menu:list-infinite-scroll'
      }
    ]
  }, {
    title: self.$t('menu.detail'),
    icon: 'unordered-list',
    path: '/detail',
    permitCode: 'menu:detail',
    children: [
      {
        title: self.$t('menu.basicDetail'),
        path: '/detail-basic',
        permitCode: 'menu:detail-basic'
      }, {
        title: self.$t('menu.complexDetail'),
        path: '/detail-complex',
        permitCode: 'menu:detail-complex'
      }
    ]
  }, {
    title: self.$t('menu.error'),
    icon: 'warning',
    path: '/error',
    permitCode: 'menu:error',
    children: [
      {
        title: self.$t('menu.error404'),
        path: '/error-404',
        permitCode: 'menu:error-404'
      }, {
        title: self.$t('menu.error403'),
        path: '/error-403',
        permitCode: 'menu:error-403'
      }, {
        title: self.$t('menu.error500'),
        path: '/error-500',
        permitCode: 'menu:error-500'
      }
    ]
  }
])

// 根据权限过滤菜单 - 未配置permitCode 不校验权限 || 校验菜单权限开关
export function getPermitMenus (self, permits = []) {
  const menuLoop = (menus) => {
    const _menus = menus.map(menu => {
      const _menu = { ...menu }
      if (_menu.children && _menu.children.length) {
        _menu.children = menuLoop(_menu.children)
      }
      return _menu
    })
    // 不校验权限菜单
    if (!PERMIT_MENU_OPEN) return _menus
    return _menus.filter(menu => !menu.permitCode || permits.includes(menu.permitCode))
  }
  return menuLoop(GLOBAL_MENUS(self))
}
