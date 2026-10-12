import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuth } from './composables/auth';
import { useToast } from './composables/toast';
import { getViewPref, isMobilePath, isMobileUA, toMobilePath } from './utils/device';

/** requiresAuth：未登录访问时提示「请先登录」并跳登录页（带 redirect 回跳）。 */
const desktop: RouteRecordRaw = {
  path: '/',
  component: () => import('./layouts/DesktopLayout.vue'),
  children: [
    { path: '', name: 'home', component: () => import('./pages/desktop/HomePage.vue') },
    { path: 'product/:id', name: 'product', component: () => import('./pages/desktop/ProductDetailPage.vue') },
    { path: 'login', name: 'login', component: () => import('./pages/desktop/LoginPage.vue') },
    { path: 'cart', name: 'cart', component: () => import('./pages/desktop/CartPage.vue'), meta: { requiresAuth: true } },
    {
      path: 'checkout',
      name: 'checkout',
      component: () => import('./pages/desktop/CheckoutPage.vue'),
      meta: { requiresAuth: true },
    },
    { path: 'orders', name: 'orders', component: () => import('./pages/desktop/OrderListPage.vue'), meta: { requiresAuth: true } },
    {
      path: 'orders/:orderNo',
      name: 'order',
      component: () => import('./pages/desktop/OrderDetailPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
};

const mobile: RouteRecordRaw = {
  path: '/m',
  component: () => import('./layouts/MobileLayout.vue'),
  children: [
    { path: '', name: 'm-home', component: () => import('./pages/mobile/HomePage.vue'), meta: { tab: 'home' } },
    { path: 'product/:id', name: 'm-product', component: () => import('./pages/mobile/ProductDetailPage.vue') },
    { path: 'login', name: 'm-login', component: () => import('./pages/mobile/LoginPage.vue') },
    {
      path: 'cart',
      name: 'm-cart',
      component: () => import('./pages/mobile/CartPage.vue'),
      meta: { requiresAuth: true, tab: 'cart' },
    },
    {
      path: 'checkout',
      name: 'm-checkout',
      component: () => import('./pages/mobile/CheckoutPage.vue'),
      meta: { requiresAuth: true },
    },
    { path: 'orders', name: 'm-orders', component: () => import('./pages/mobile/OrderListPage.vue'), meta: { requiresAuth: true } },
    {
      path: 'orders/:orderNo',
      name: 'm-order',
      component: () => import('./pages/mobile/OrderDetailPage.vue'),
      meta: { requiresAuth: true },
    },
    { path: 'me', name: 'm-me', component: () => import('./pages/mobile/MePage.vue'), meta: { tab: 'me' } },
    { path: ':pathMatch(.*)*', redirect: '/m' },
  ],
};

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    mobile,
    desktop,
    // 未知路由兜底回首页：自动化里访问非法路由时可断言落点
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
  // 移动设备访问 PC 地址 → 自动跳 H5（用户手动选了「电脑版」则不跳）
  if (!isMobilePath(to.path) && isMobileUA() && getViewPref() !== 'desktop') {
    return toMobilePath(to.fullPath);
  }
  if (to.meta.requiresAuth && !useAuth().isLoggedIn.value) {
    useToast().show('请先登录');
    return { path: isMobilePath(to.path) ? '/m/login' : '/login', query: { redirect: to.fullPath } };
  }
  return true;
});
