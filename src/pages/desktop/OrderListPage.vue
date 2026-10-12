<script setup lang="ts">
import { ORDER_TABS, useOrderList } from '../../features/useOrders';
import { ORDER_STATUS_TEXT, formatPrice, formatTime } from '../../utils/format';

const { status, orders, loading, pay, cancel } = useOrderList();
</script>

<template>
  <div class="orders-page">
    <h1 class="page-title" data-testid="orders-title">我的订单</h1>

    <div class="category-tabs" data-testid="order-tabs">
      <button
        v-for="t in ORDER_TABS"
        :key="t.key"
        class="category-tab"
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
      <router-link to="/" class="btn btn-primary">去逛逛</router-link>
    </div>

    <div v-else class="order-list">
      <article v-for="o in orders" :key="o.orderNo" class="order-card" :data-testid="`order-card-${o.orderNo}`">
        <header class="order-card-head">
          <span>订单号：<b data-testid="order-no">{{ o.orderNo }}</b></span>
          <span class="muted">{{ formatTime(o.createdAt) }}</span>
          <span class="status-tag" :class="`status-${o.status}`" data-testid="order-status">{{ ORDER_STATUS_TEXT[o.status] }}</span>
        </header>
        <ul class="line-list">
          <li v-for="l in o.lines" :key="l.productId">
            <span class="mini-swatch" :style="{ background: l.swatch }"></span>
            <span class="line-name">{{ l.productName }}</span>
            <span class="line-qty">× {{ l.qty }}</span>
          </li>
        </ul>
        <footer class="order-card-foot">
          <span>共 {{ o.totalCount }} 件，实付 <b data-testid="order-pay-amount">{{ formatPrice(o.payAmount) }}</b></span>
          <div class="order-actions">
            <router-link :to="`/orders/${o.orderNo}`" class="btn btn-ghost" data-testid="order-view">查看详情</router-link>
            <template v-if="o.status === 'PENDING_PAYMENT'">
              <button class="btn btn-ghost" data-testid="order-cancel" @click="cancel(o)">取消订单</button>
              <button class="btn btn-primary" data-testid="order-pay" @click="pay(o)">去支付</button>
            </template>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>
