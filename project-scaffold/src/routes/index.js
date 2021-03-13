// 基础路由
const routes = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404')
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500')
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
          default: () => import('@/views/user/Login'),
          bg: () => import('@/layouts/LoginBackground')
        }
      },
      {
        path: '/user/register',
        name: 'register',
        components: {
          default: () => import('@/views/user/Register'),
          bg: () => import('@/layouts/RegisterBackground')
        }
      },
      {
        path: '/user/forget-password',
        name: 'forget-password',
        components: {
          default: () => import('@/views/user/ForgetPassword'),
          bg: () => import('@/layouts/ForgetPasswordBackground')
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
