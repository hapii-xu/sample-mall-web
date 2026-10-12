<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/auth';
import { useToast } from '../../composables/toast';
import { ORDER_TABS } from '../../features/useOrders';
import { setViewPref } from '../../utils/device';

/** H5「我的」（REQ-061）：用户信息、订单入口、退出登录、切换电脑版。 */
const router = useRouter();
const { user, isLoggedIn, logout } = useAuth();
const { show } = useToast();

function onLogout() {
  logout();
  show('已退出登录');
}

function switchToDesktop() {
  setViewPref('desktop');
  router.push('/');
}
</script>

<template>
  <div class="m-me">
    <section class="m-user-card" data-testid="m-user-card">
      <template v-if="isLoggedIn && user">
        <span class="m-avatar">{{ user.displayName.slice(0, 1) }}</span>
        <div>
          <p class="m-user-name" data-testid="welcome-user">你好，{{ user.displayName }}</p>
          <p class="m-user-sub">{{ user.username }}</p>
        </div>
      </template>
      <template v-else>
        <span class="m-avatar">?</span>
        <router-link to="/m/login?redirect=/m/me" class="btn btn-primary" data-testid="nav-login">去登录</router-link>
      </template>
    </section>

    <section class="m-section">
      <div class="m-list-head">
        <b>我的订单</b>
        <router-link to="/m/orders" class="link-btn" data-testid="me-all-orders">全部订单 ›</router-link>
      </div>
      <div class="m-order-entries">
        <router-link
          v-for="t in ORDER_TABS.slice(1)"
          :key="t.key"
          :to="`/m/orders?status=${t.key}`"
          class="m-order-entry"
          :data-testid="`me-orders-${t.key}`"
        >
          {{ t.label }}
        </router-link>
      </div>
    </section>

    <section class="m-section m-menu">
      <a href="javascript:void(0)" data-testid="switch-desktop" @click="switchToDesktop">切换到电脑版</a>
      <button v-if="isLoggedIn" class="btn btn-ghost btn-block" data-testid="logout-button" @click="onLogout">退出登录</button>
    </section>
  </div>
</template>
