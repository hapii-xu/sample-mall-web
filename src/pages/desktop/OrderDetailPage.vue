<script setup lang="ts">
import { useOrderDetail } from '../../features/useOrders';
import { ORDER_STATUS_TEXT, formatPrice, formatTime } from '../../utils/format';

const { order, loading, pay, cancel } = useOrderDetail();
</script>

<template>
  <div class="order-detail-page">
    <nav class="breadcrumb" data-testid="breadcrumb">
      <router-link to="/orders" data-testid="breadcrumb-orders">我的订单</router-link>
      <span class="breadcrumb-sep">/</span>
      <span>订单详情</span>
    </nav>

    <p v-if="loading" class="empty-text" data-testid="order-loading">加载中…</p>
    <div v-else-if="!order" class="empty-box" data-testid="order-not-found">
      <p>订单不存在</p>
      <router-link to="/orders" class="btn btn-primary">返回我的订单</router-link>
    </div>

    <template v-else>
      <section class="panel status-panel" data-testid="order-status-panel">
        <span class="status-tag big" :class="`status-${order.status}`" data-testid="order-status">{{ ORDER_STATUS_TEXT[order.status] }}</span>
        <span>订单号：<b data-testid="order-no">{{ order.orderNo }}</b></span>
        <div v-if="order.status === 'PENDING_PAYMENT'" class="order-actions">
          <button class="btn btn-ghost" data-testid="order-cancel" @click="cancel">取消订单</button>
          <button class="btn btn-primary" data-testid="order-pay" @click="pay">立即支付</button>
        </div>
      </section>

      <div class="checkout-layout">
        <section class="panel" data-testid="order-receiver">
          <h2 class="panel-title">收货信息</h2>
          <p data-testid="order-receiver-name">{{ order.receiverName }}　{{ order.receiverPhone }}</p>
          <p data-testid="order-receiver-address">{{ order.receiverAddress }}</p>
          <p v-if="order.remark" class="muted" data-testid="order-remark">备注：{{ order.remark }}</p>
          <h2 class="panel-title">订单时间</h2>
          <p class="muted">下单：{{ formatTime(order.createdAt) }}</p>
          <p v-if="order.paidAt" class="muted" data-testid="order-paid-at">支付：{{ formatTime(order.paidAt) }}</p>
          <p v-if="order.cancelledAt" class="muted" data-testid="order-cancelled-at">取消：{{ formatTime(order.cancelledAt) }}</p>
        </section>

        <section class="panel" data-testid="order-items">
          <h2 class="panel-title">商品清单</h2>
          <ul class="line-list">
            <li v-for="l in order.lines" :key="l.productId" :data-testid="`order-line-${l.productId}`">
              <span class="mini-swatch" :style="{ background: l.swatch }"></span>
              <span class="line-name">{{ l.productName }}</span>
              <span class="line-qty">× {{ l.qty }}</span>
              <span class="line-amount">{{ formatPrice(l.price * l.qty) }}</span>
            </li>
          </ul>
          <dl class="amount-list">
            <dt>商品金额</dt>
            <dd data-testid="order-items-amount">{{ formatPrice(order.itemsAmount) }}</dd>
            <dt>运费</dt>
            <dd data-testid="order-shipping-fee">{{ order.shippingFee > 0 ? formatPrice(order.shippingFee) : '免运费' }}</dd>
            <dt class="pay-amount">实付金额</dt>
            <dd class="pay-amount" data-testid="order-pay-amount">{{ formatPrice(order.payAmount) }}</dd>
          </dl>
        </section>
      </div>
    </template>
  </div>
</template>
