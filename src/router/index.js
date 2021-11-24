import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';

// 路由规则设置
const routes = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue'),
  },
  // 首页
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
  },
  // 分类页
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/Category/index.vue'),
  },
  // 分类页详情
  {
    path: '/category-detail/:categoryId',
    name: 'category-detail',
    component: () => import('@/views/CategoryDetail/index.vue'),
    props: true,
  },
  // 订单页
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Order/index.vue'),
    props: true,
    meta: {
      requireAuth: true,
    },
  },
  // 订单详情页
  {
    path: '/order-detail/:orderId',
    name: 'order-detail',
    component: () => import('@/views/OrderDetail/index.vue'),
    props: true,
    meta: {
      requireAuth: true,
    },
  },
  // 订单确认
  {
    path: '/order-confirm',
    name: 'order-confirm',
    component: () => import('@/views/OrderConfirm/index.vue'),
    props: true,
    meta: {
      requireAuth: true,
    },
  },
  // 新增地址
  {
    path: '/add-address',
    name: 'add-address',
    component: () => import('@/views/Address/index.vue'),
    props: true,
    meta: {
      requireAuth: true,
    },
  },
  // 支付
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/views/Pay/index.vue'),
    props: true,
    meta: { requireAuth: true },
  },
  // 商品详情
  {
    path: '/product/:productId',
    name: 'product',
    component: () => import('@/views/Product/index.vue'),
    props: true,
  },
  // 商品评论
  {
    path: '/comment/:productId',
    name: 'comment',
    component: () => import('@/views/Comment/index.vue'),
    props: true,
  },
  // 推荐
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/views/Recommend/index.vue'),
  },
  // 购物车
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart/index.vue'),
    // meta: { requireAuth: true },
  },
  // 搜索
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search/index.vue'),
  },
  // 用户
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/index.vue'),
    // meta: { requireAuth: true },
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound/index.vue'),
  },
];

// 创建router实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 导航守卫
router.beforeEach((to) => {
  // 无需登录的页面可以正常访问
  if (!to.meta.requireAuth) {
    return true;
  }
  // 校验登陆状态
  if (!store.state.user.token || !window.localStorage.getItem('USERTOKEN')) {
    // 跳转登录页
    console.log('请先登录');
    console.log(to);
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    };
  }
});

export default router;
