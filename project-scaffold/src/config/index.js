// 基础配置
/**
 * title 菜单标题
 * icon 菜单图标
 * iconClass 菜单自定义图标类
 * permitCode 菜单权限码
 * disabled 禁用菜单
 * children 子菜单
 */
export const GLOBAL_MENUS = [
  {
    title: 'Home',
    icon: 'home',
    link: '/home',
    permitCode: 'menu:home',
    children: []
  }, {
    title: 'Dashboard',
    icon: 'dashboard', // iconClass 自定义图表类
    link: '/dashboard',
    permitCode: 'menu:dashboard'
  }, {
    title: 'Form',
    icon: 'profile',
    link: '/form',
    permitCode: 'menu:form',
    children: [
      {
        title: 'Basic form',
        link: '/form/basic',
        permitCode: 'menu:form-basic'
      }, {
        title: 'Complex form',
        link: '/form/complex',
        permitCode: 'menu:form-complex'
      }
    ]
  }
]
