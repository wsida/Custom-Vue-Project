// 基础路由
const routes = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/400')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/400')
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/400')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/layouts/UserLayout'),
    children: [
      {
        path: '/user/login',
        name: 'login',
        components: {
          default: () => import('@/views/error/400'),
          bg: () => import('@/layouts/LoginBackground')
        }
      },
      {
        path: '/register',
        name: 'register',
        components: {
          default: () => import('@/views/error/400'),
          bg: () => import('@/layouts/RegisterBackground')
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404'
  }
]

export default routes
