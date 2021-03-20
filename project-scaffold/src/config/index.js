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
export const GLOBAL_MENUS = [
  {
    title: 'Dashboard',
    icon: 'dashboard', // iconClass 自定义图表类
    path: '/dashboard',
    permitCode: 'menu:dashboard'
  }, {
    title: 'Form',
    icon: 'profile',
    path: '/form',
    permitCode: 'menu:form',
    children: [
      {
        title: 'Basic form',
        path: '/form-basic',
        permitCode: 'menu:form-basic'
      }, {
        title: 'Complex form',
        path: '/form-complex',
        permitCode: 'menu:form-complex'
      }
    ]
  }, {
    title: 'Table',
    icon: 'table',
    path: '/table',
    permitCode: 'menu:table',
    children: [
      {
        title: 'Basic table',
        path: '/table-basic',
        permitCode: 'menu:table-basic'
      }, {
        title: 'Complex table',
        path: '/table-complex',
        permitCode: 'menu:table-complex'
      }
    ]
  }, {
    title: 'List',
    icon: 'unordered-list',
    path: '/list',
    permitCode: 'menu:list',
    children: [
      {
        title: 'Basic list',
        path: '/list-basic',
        permitCode: 'menu:list-basic'
      }, {
        title: 'Infinite scroll list',
        path: '/list-infinite-scroll',
        permitCode: 'menu:list-infinite-scroll'
      }
    ]
  }
]

export function getPermitMenus (permits = []) {
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
  return menuLoop(GLOBAL_MENUS)
}
