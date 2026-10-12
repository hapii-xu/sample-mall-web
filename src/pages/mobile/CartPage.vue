<script setup lang="ts">
import QtyStepper from '../../components/QtyStepper.vue';
import { useCartPage } from '../../features/useCartPage';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../../utils/format';

const { cart, items, loading, availableCount, changeQty, removeItem, clearAll, checkout } = useCartPage();
</script>

<template>
  <div class="m-cart">
    <p v-if="loading" class="empty-text" data-testid="cart-loading">加载中…</p>

    <div v-else-if="items.length === 0" class="empty-box" data-testid="cart-empty">
      <p>购物车还是空的，去挑几款好茶吧</p>
      <router-link to="/m" class="btn btn-primary" data-testid="cart-go-shopping">去逛逛</router-link>
    </div>

    <template v-else>
      <div class="m-list-head">
        <span data-testid="cart-title">共 {{ cart?.totalCount ?? 0 }} 件商品</span>
        <button class="link-btn" data-testid="cart-clear" @click="clearAll">清空</button>
      </div>

      <article
        v-for="i in items"
        :key="i.productId"
        class="m-cart-item"
        :class="{ unavailable: !i.available }"
        :data-testid="`cart-item-${i.productId}`"
      >
        <span class="m-cart-swatch" :style="{ background: i.swatch }"></span>
        <div class="m-cart-info">
          <router-link :to="`/m/product/${i.productId}`" class="cart-name" :data-testid="`cart-item-name-${i.productId}`">{{ i.name }}</router-link>
          <p v-if="!i.available" class="cart-warn" :data-testid="`cart-item-warn-${i.productId}`">{{ i.unavailableReason }}</p>
          <div class="m-cart-row">
            <span class="card-price" :data-testid="`cart-item-price-${i.productId}`">{{ formatPrice(i.price) }}</span>
            <QtyStepper
              :model-value="i.qty"
              :max="99"
              :testid-prefix="`cart-qty-${i.productId}`"
              @update:model-value="(v: number) => changeQty(i.productId, v)"
            />
          </div>
        </div>
        <button class="m-cart-remove" :data-testid="`cart-item-remove-${i.productId}`" aria-label="删除" @click="removeItem(i.productId, i.name)">×</button>
      </article>

      <p class="m-shipping-tip" data-testid="cart-shipping-tip">
        {{ cart && cart.shippingFee > 0 ? `再买 ${formatPrice(FREE_SHIPPING_THRESHOLD - cart.itemsAmount)} 即可包邮` : '已满 ¥99，免运费' }}
      </p>

      <div class="m-submit-bar m-submit-bar--above-tabs" data-testid="cart-summary">
        <div class="m-submit-amount">
          合计 <b data-testid="cart-pay-amount">{{ formatPrice(cart?.payAmount ?? 0) }}</b>
          <small data-testid="cart-shipping-fee">运费 {{ formatPrice(cart?.shippingFee ?? 0) }}</small>
        </div>
        <button class="btn btn-primary" data-testid="cart-checkout" :disabled="availableCount === 0" @click="checkout">去结算</button>
      </div>
    </template>
  </div>
</template>
