// 动态路由-权限路由
/**
 * routes 配置项
 * 新增 meta 字段
 * permitCode: 菜单权限码
 * menu: 路由所属左侧菜单地址（主要设置二级页面）
 */
export const ROOT_ROUTE = {
  path: '/',
  name: 'app',
  component: () => import('@/layouts/BasicLayout')
}

const ASYNC_ROUTES = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Index'),
    meta: {
      permitCode: 'page:dashboard'
    }
  }, {
    path: '/form',
    name: 'form',
    // redirect: 'form-basic', // 未配置component或者redirect 则自动设置第一个权限路由
    meta: {
      permitCode: 'page:form'
    }
  }, {
    path: '/form-basic',
    name: 'form-basic',
    component: () => import('@/views/form/BasicForm'),
    meta: {
      permitCode: 'page:form-basic'
    }
  }, {
    path: '/form-complex',
    name: 'form-complex',
    component: () => import('@/views/form/ComplexForm'),
    meta: {
      permitCode: 'page:form-complex'
    }
  }, {
    path: '/table',
    name: 'table',
    // redirect: 'table-basic', // 未配置component或者redirect 则自动设置第一个权限路由
    meta: {
      permitCode: 'page:table'
    }
  }, {
    path: '/table-basic',
    name: 'table-basic',
    component: () => import('@/views/table/BasicTable'),
    meta: {
      permitCode: 'page:table-basic'
    }
  }, {
    path: '/table-complex',
    name: 'table-complex',
    component: () => import('@/views/table/ComplexTable'),
    meta: {
      permitCode: 'page:table-complex'
    }
  }, {
    path: '/list',
    name: 'list',
    // redirect: 'list-basic', // 未配置component或者redirect 则自动设置第一个权限路由
    meta: {
      permitCode: 'page:list'
    }
  }, {
    path: '/list-basic',
    name: 'list-basic',
    component: () => import('@/views/list/BasicList'),
    meta: {
      permitCode: 'page:list-basic'
    }
  }, {
    path: '/list-infinite-scroll',
    name: 'list-infinite-scroll',
    component: () => import('@/views/list/InfiniteScrollList'),
    meta: {
      permitCode: 'page:list-infinite-scroll'
    }
  }
]

/**
 * 如果 index.html 由后端维护，可以直接在window种下账号权限，
 * 利用 getRoutes 方法直接获取权限动态路由，避免复杂的路由守卫逻辑
 */
// 绑定动态路由的根路由
export function getAsyncRoute (routes) {
  const rootRoute = {
    ...ROOT_ROUTE
  }
  if (!routes || !routes.length) {
    rootRoute.redirect = '/404'
  } else {
    rootRoute.redirect = routes[0].path
    rootRoute.children = routes
  }
  return rootRoute
}

// 根据权限码返回路由配置
export default function getRoutes (permits) {
  if (!permits || !permits.length) return getAsyncRoute(ASYNC_ROUTES)
  const permitLoop = (routes) => {
    if (routes.children && routes.children.length) {
      routes.children = permitLoop(routes.children)
    }
    return routes.filter(route => !route.permitCode || permits.includes(route.permitCode))
  }
  // 未配置component或者redirect 则自动设置第一个权限路由
  const redirectLoop = (routers) => {
    return routers.map(route => {
      if (route.children && route.children.length) {
        if (!route.component || !route.redirect) {
          route.redirect = route.children[0].path
        }
        route.children = redirectLoop(route.children)
      }
      return route
    })
  }
  // 路由 -> 权限过滤 -> 自动设置redirect -> 绑定根路由
  return getAsyncRoute(redirectLoop(permitLoop(ASYNC_ROUTES)))
}
