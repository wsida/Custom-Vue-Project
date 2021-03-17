// 基础路由
import staticRoutes from './staticRoutes'

const routes = [
  ...staticRoutes,
  {
    path: '*',
    redirect: '/404'
  }
]

export default routes
