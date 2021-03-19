// 路由配置
const routes = [
  {
    name: 'home',
    path: '/home',
    component: () => import('@/views/Home')
  }
];

export default routes;
