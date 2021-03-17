// 动态路由-权限路由
export const ROOT_ROUTE = {
  path: '/',
  name: 'app',
  component: () => import('@/layouts/BasicLayout')
}

const ASYNC_ROUTES = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home'),
    meta: {
      permitCode: 'wsd:home'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Index'),
    meta: {
      permitCode: 'wsd:dashboard'
    }
  }
]

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

export default function getRoutes (permits) {
  if (!permits) return getAsyncRoute(ASYNC_ROUTES)
  const permitLoop = (routes) => {
    if (routes.children && routes.children.length) {
      routes.children = permitLoop(routes.children)
    }
    return routes.filter(route => !route.permitCode || permits.includes(route.permitCode))
  }
  return getAsyncRoute(permitLoop(ASYNC_ROUTES))
}
