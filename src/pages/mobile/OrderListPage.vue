<script setup lang="ts">
import { ORDER_TABS, useOrderList } from '../../features/useOrders';
import { ORDER_STATUS_TEXT, formatPrice } from '../../utils/format';

const { status, orders, loading, pay, cancel } = useOrderList();
</script>

<template>
  <div class="m-orders">
    <div class="m-chips m-chips--even" data-testid="order-tabs">
      <button
        v-for="t in ORDER_TABS"
        :key="t.key"
        class="m-chip"
        :class="{ active: status === t.key }"
        :data-testid="`order-tab-${t.key || 'ALL'}`"
        @click="status = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <p v-if="loading" class="empty-text" data-testid="orders-loading">加载中…</p>
    <div v-else-if="orders.length === 0" class="empty-box" data-testid="orders-empty">
      <p>暂无订单</p>
      <router-link to="/m" class="btn btn-primary">去逛逛</router-link>
    </div>

    <template v-else>
      <article v-for="o in orders" :key="o.orderNo" class="m-section m-order-card" :data-testid="`order-card-${o.orderNo}`">
      <header class="order-card-head">
        <span class="muted" data-testid="order-no">{{ o.orderNo }}</span>
        <span class="status-tag" :class="`status-${o.status}`" data-testid="order-status">{{ ORDER_STATUS_TEXT[o.status] }}</span>
      </header>
      <router-link :to="`/m/orders/${o.orderNo}`" class="m-order-lines" data-testid="order-view">
        <span v-for="l in o.lines" :key="l.productId" class="mini-swatch" :style="{ background: l.swatch }" :title="l.productName"></span>
        <span class="muted">{{ o.lines.map((l) => l.productName).join('、') }}</span>
      </router-link>
      <footer class="order-card-foot">
        <span>共 {{ o.totalCount }} 件 实付 <b data-testid="order-pay-amount">{{ formatPrice(o.payAmount) }}</b></span>
        <div v-if="o.status === 'PENDING_PAYMENT'" class="order-actions">
          <button class="btn btn-ghost btn-sm" data-testid="order-cancel" @click="cancel(o)">取消订单</button>
          <button class="btn btn-primary btn-sm" data-testid="order-pay" @click="pay(o)">去支付</button>
        </div>
      </footer>
      </article>
    </template>
  </div>
</template>
