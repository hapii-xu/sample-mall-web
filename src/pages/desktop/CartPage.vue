<script setup lang="ts">
import QtyStepper from '../../components/QtyStepper.vue';
import { useCartPage } from '../../features/useCartPage';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../../utils/format';

const { cart, items, loading, availableCount, changeQty, removeItem, clearAll, checkout } = useCartPage();
</script>

<template>
  <div class="cart-page">
    <div class="page-head">
      <h1 class="page-title" data-testid="cart-title">我的购物车</h1>
      <button v-if="items.length" class="btn btn-ghost" data-testid="cart-clear" @click="clearAll">清空购物车</button>
    </div>

    <p v-if="loading" class="empty-text" data-testid="cart-loading">加载中…</p>

    <div v-else-if="items.length === 0" class="empty-box" data-testid="cart-empty">
      <p>购物车还是空的，去挑几款好茶吧</p>
      <router-link to="/" class="btn btn-primary" data-testid="cart-go-shopping">去逛逛</router-link>
    </div>

    <template v-else>
      <table class="cart-table" data-testid="cart-table">
        <thead>
          <tr>
            <th>商品</th>
            <th>单价</th>
            <th>数量</th>
            <th>小计</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="i in items"
            :key="i.productId"
            :class="{ unavailable: !i.available }"
            :data-testid="`cart-item-${i.productId}`"
          >
            <td>
              <div class="cart-product">
                <span class="mini-swatch" :style="{ background: i.swatch }"></span>
                <div>
                  <router-link :to="`/product/${i.productId}`" class="cart-name" :data-testid="`cart-item-name-${i.productId}`">
                    {{ i.name }}
                  </router-link>
                  <p v-if="!i.available" class="cart-warn" :data-testid="`cart-item-warn-${i.productId}`">
                    {{ i.unavailableReason }}
                  </p>
                </div>
              </div>
            </td>
            <td :data-testid="`cart-item-price-${i.productId}`">{{ formatPrice(i.price) }}</td>
            <td>
              <QtyStepper
                :model-value="i.qty"
                :max="99"
                :testid-prefix="`cart-qty-${i.productId}`"
                @update:model-value="(v: number) => changeQty(i.productId, v)"
              />
            </td>
            <td class="cart-subtotal" :data-testid="`cart-item-subtotal-${i.productId}`">{{ formatPrice(i.subtotal) }}</td>
            <td>
              <button class="link-btn" :data-testid="`cart-item-remove-${i.productId}`" @click="removeItem(i.productId, i.name)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="summary-bar" data-testid="cart-summary">
        <p class="shipping-tip" data-testid="cart-shipping-tip">
          {{
            cart && cart.shippingFee > 0
              ? `再买 ${formatPrice(FREE_SHIPPING_THRESHOLD - cart.itemsAmount)} 即可包邮`
              : '已满 ¥99，免运费'
          }}
        </p>
        <div class="summary-amounts">
          <span>商品合计：<b data-testid="cart-items-amount">{{ formatPrice(cart?.itemsAmount ?? 0) }}</b></span>
          <span>运费：<b data-testid="cart-shipping-fee">{{ formatPrice(cart?.shippingFee ?? 0) }}</b></span>
          <span class="pay-amount">应付：<b data-testid="cart-pay-amount">{{ formatPrice(cart?.payAmount ?? 0) }}</b></span>
        </div>
        <button class="btn btn-primary btn-lg" data-testid="cart-checkout" :disabled="availableCount === 0" @click="checkout">
          去结算
        </button>
      </div>
    </template>
  </div>
</template>
