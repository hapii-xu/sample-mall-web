<script setup lang="ts">
import { useOrderDetail } from '../../features/useOrders';
import { ORDER_STATUS_TEXT, formatPrice, formatTime } from '../../utils/format';

const { order, loading, pay, cancel } = useOrderDetail();
</script>

<template>
  <div class="m-order-detail">
    <p v-if="loading" class="empty-text" data-testid="order-loading">加载中…</p>
    <div v-else-if="!order" class="empty-box" data-testid="order-not-found">
      <p>订单不存在</p>
      <router-link to="/m/orders" class="btn btn-primary">返回我的订单</router-link>
    </div>

    <template v-else>
      <section class="m-status-banner" :class="`status-${order.status}`" data-testid="order-status-panel">
        <b data-testid="order-status">{{ ORDER_STATUS_TEXT[order.status] }}</b>
        <span>订单号 <span data-testid="order-no">{{ order.orderNo }}</span></span>
      </section>

      <section class="m-section" data-testid="order-receiver">
        <p data-testid="order-receiver-name"><b>{{ order.receiverName }}</b>　{{ order.receiverPhone }}</p>
        <p class="muted" data-testid="order-receiver-address">{{ order.receiverAddress }}</p>
        <p v-if="order.remark" class="muted" data-testid="order-remark">备注：{{ order.remark }}</p>
      </section>

      <section class="m-section" data-testid="order-items">
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

      <section class="m-section muted">
        <p>下单时间：{{ formatTime(order.createdAt) }}</p>
        <p v-if="order.paidAt" data-testid="order-paid-at">支付时间：{{ formatTime(order.paidAt) }}</p>
        <p v-if="order.cancelledAt" data-testid="order-cancelled-at">取消时间：{{ formatTime(order.cancelledAt) }}</p>
      </section>

      <div v-if="order.status === 'PENDING_PAYMENT'" class="m-submit-bar" data-testid="order-action-bar">
        <button class="btn btn-ghost" data-testid="order-cancel" @click="cancel">取消订单</button>
        <button class="btn btn-primary" data-testid="order-pay" @click="pay">立即支付</button>
      </div>
    </template>
  </div>
</template>
