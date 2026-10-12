<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/auth';
import { useCart } from '../composables/cart';
import { useToast } from '../composables/toast';
import { setViewPref, toMobilePath } from '../utils/device';

const route = useRoute();
const router = useRouter();
const { user, isLoggedIn, logout } = useAuth();
const { totalCount } = useCart();
const { show } = useToast();

function onLogout() {
  logout();
  show('已退出登录');
  if (route.meta.requiresAuth) router.push('/');
}

function switchToMobile() {
  setViewPref('mobile');
  router.push(toMobilePath(route.fullPath));
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <router-link to="/" class="brand" data-testid="brand-home">
          <span class="brand-mark">山</span>
          <span class="brand-name">山野茶铺</span>
          <span class="brand-sub">Sample Mall</span>
        </router-link>

        <nav class="main-nav" data-testid="main-nav">
          <router-link to="/" data-testid="nav-home" exact-active-class="router-link-active">首页</router-link>
          <router-link v-if="isLoggedIn" to="/orders" data-testid="nav-orders">我的订单</router-link>
        </nav>

        <div class="header-actions">
          <router-link to="/cart" class="cart-entry" data-testid="cart">
            <span>购物车</span>
            <span
              v-if="totalCount > 0"
              class="cart-badge"
              data-testid="cart-badge"
              :aria-label="`购物车 ${totalCount} 件商品`"
            >
              {{ totalCount }}
            </span>
          </router-link>

          <template v-if="isLoggedIn && user">
            <span class="welcome" data-testid="welcome-user">你好，{{ user.displayName }}</span>
            <button class="btn btn-ghost" data-testid="logout-button" @click="onLogout">退出登录</button>
          </template>
          <router-link v-else to="/login" class="btn btn-primary" data-testid="nav-login">登录</router-link>
        </div>
      </div>
    </header>

    <main class="page-main">
      <router-view />
    </main>

    <footer class="app-footer" data-testid="site-footer">
      <p>
        山野茶铺 · Sample Mall 示例商城（演示站点，数据均为虚构）·
        <a href="javascript:void(0)" data-testid="switch-mobile" @click="switchToMobile">手机版</a>
      </p>
    </footer>
  </div>
</template>
