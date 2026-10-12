<script setup lang="ts">
import { useCheckout } from '../../features/useCheckout';
import { formatPrice } from '../../utils/format';

const { preview, loading, loadError, form, errors, submitting, submit } = useCheckout();
</script>

<template>
  <div class="checkout-page">
    <h1 class="page-title" data-testid="checkout-title">确认订单</h1>

    <p v-if="loading" class="empty-text" data-testid="checkout-loading">加载中…</p>
    <div v-else-if="loadError" class="empty-box" data-testid="checkout-error">
      <p>{{ loadError }}</p>
      <router-link to="/cart" class="btn btn-primary">返回购物车</router-link>
    </div>

    <div v-else-if="preview" class="checkout-layout">
      <section class="panel" data-testid="receiver-form">
        <h2 class="panel-title">收货信息</h2>
        <label class="field">
          <span class="field-label">收货人</span>
          <input v-model="form.receiverName" class="field-input" data-testid="receiver-name" maxlength="20" placeholder="请输入收货人姓名" />
          <span v-if="errors.receiverName" class="field-error" data-testid="receiver-name-error">{{ errors.receiverName }}</span>
        </label>
        <label class="field">
          <span class="field-label">手机号</span>
          <input v-model="form.receiverPhone" class="field-input" data-testid="receiver-phone" maxlength="11" placeholder="11 位手机号" />
          <span v-if="errors.receiverPhone" class="field-error" data-testid="receiver-phone-error">{{ errors.receiverPhone }}</span>
        </label>
        <label class="field">
          <span class="field-label">收货地址</span>
          <input v-model="form.receiverAddress" class="field-input" data-testid="receiver-address" maxlength="100" placeholder="省 / 市 / 区 / 详细地址" />
          <span v-if="errors.receiverAddress" class="field-error" data-testid="receiver-address-error">{{ errors.receiverAddress }}</span>
        </label>
        <label class="field">
          <span class="field-label">订单备注（选填）</span>
          <input v-model="form.remark" class="field-input" data-testid="order-remark" maxlength="100" placeholder="如：请尽快发货" />
        </label>
      </section>

      <section class="panel" data-testid="checkout-items">
        <h2 class="panel-title">商品清单</h2>
        <ul class="line-list">
          <li v-for="l in preview.lines" :key="l.productId" :data-testid="`checkout-line-${l.productId}`">
            <span class="mini-swatch" :style="{ background: l.swatch }"></span>
            <span class="line-name">{{ l.productName }}</span>
            <span class="line-qty">× {{ l.qty }}</span>
            <span class="line-amount">{{ formatPrice(l.price * l.qty) }}</span>
          </li>
        </ul>
        <dl class="amount-list">
          <dt>商品金额</dt>
          <dd data-testid="checkout-items-amount">{{ formatPrice(preview.itemsAmount) }}</dd>
          <dt>运费</dt>
          <dd data-testid="checkout-shipping-fee">{{ preview.shippingFee > 0 ? formatPrice(preview.shippingFee) : '免运费' }}</dd>
          <dt class="pay-amount">应付金额</dt>
          <dd class="pay-amount" data-testid="checkout-pay-amount">{{ formatPrice(preview.payAmount) }}</dd>
        </dl>
        <button class="btn btn-primary btn-lg btn-block" data-testid="submit-order" :disabled="submitting" @click="submit">
          {{ submitting ? '提交中…' : '提交订单' }}
        </button>
      </section>
    </div>
  </div>
</template>
