<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCart } from '../composables/cart';

/** H5 外壳（REQ-060）：顶部标题栏（非 Tab 页带返回）+ 底部 Tab（首页 / 购物车 / 我的）。 */
const route = useRoute();
const router = useRouter();
const { totalCount } = useCart();

const TITLES: Record<string, string> = {
  'm-home': '山野茶铺',
  'm-product': '商品详情',
  'm-login': '会员登录',
  'm-cart': '购物车',
  'm-checkout': '确认订单',
  'm-orders': '我的订单',
  'm-order': '订单详情',
  'm-me': '我的',
};

const title = computed(() => TITLES[String(route.name)] ?? '山野茶铺');
const tab = computed(() => route.meta.tab as string | undefined);

function back() {
  if (window.history.state?.back) router.back();
  else router.push('/m');
}
</script>

<template>
  <div class="m-shell" :class="{ 'has-tabbar': tab }">
    <header class="m-topbar" data-testid="m-topbar">
      <button v-if="!tab" class="m-back" data-testid="m-back" aria-label="返回" @click="back">‹</button>
      <h1 class="m-title" data-testid="m-title">{{ title }}</h1>
    </header>

    <main class="m-main">
      <router-view />
    </main>

    <nav v-if="tab" class="m-tabbar" data-testid="m-tabbar">
      <router-link to="/m" class="m-tab" :class="{ active: tab === 'home' }" data-testid="m-tab-home">
        <span class="m-tab-icon">⌂</span><span>首页</span>
      </router-link>
      <router-link to="/m/cart" class="m-tab" :class="{ active: tab === 'cart' }" data-testid="m-tab-cart">
        <span class="m-tab-icon">🛒</span><span>购物车</span>
        <span v-if="totalCount > 0" class="m-tab-badge" data-testid="cart-badge">{{ totalCount }}</span>
      </router-link>
      <router-link to="/m/me" class="m-tab" :class="{ active: tab === 'me' }" data-testid="m-tab-me">
        <span class="m-tab-icon">☺</span><span>我的</span>
      </router-link>
    </nav>
  </div>
</template>
