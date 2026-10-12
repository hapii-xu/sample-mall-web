<script setup lang="ts">
import QtyStepper from '../../components/QtyStepper.vue';
import { useProductDetail } from '../../features/useProductDetail';
import { formatPrice } from '../../utils/format';

const { loading, product, qty, maxQty, soldOut, totalPrice, adding, addToCart, buyNow } = useProductDetail();
</script>

<template>
  <div class="m-detail">
    <div v-if="loading" class="detail-skeleton m-pad" data-testid="detail-skeleton">
      <div class="skeleton-block skeleton-swatch"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line w-60"></div>
        <div class="skeleton-line w-90"></div>
      </div>
    </div>

    <div v-else-if="!product" class="empty-box" data-testid="detail-not-found">
      <p>商品不存在或已下架</p>
      <router-link to="/m" class="btn btn-primary" data-testid="back-home-from-empty">返回首页</router-link>
    </div>

    <template v-else>
      <div class="m-detail-swatch" :style="{ background: product.swatch }">
        <span v-if="product.originalPrice" class="card-badge">限时特惠</span>
      </div>

      <section class="m-section">
        <div class="price-row" data-testid="detail-price-row">
          <span class="detail-price" data-testid="detail-price">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice" class="card-price-original">{{ formatPrice(product.originalPrice) }}</span>
        </div>
        <h2 class="m-detail-name" data-testid="detail-name">{{ product.name }}</h2>
        <p class="detail-tagline">{{ product.tagline }}</p>
        <ul class="fact-list">
          <li data-testid="detail-origin">产地：{{ product.origin }}</li>
          <li data-testid="detail-stock">库存：{{ soldOut ? '已售罄' : `剩 ${product.stock} 件` }}</li>
          <li data-testid="detail-shipping">运费：满 ¥99 包邮，不满收取 ¥10</li>
        </ul>
      </section>

      <section class="m-section m-qty-row">
        <span class="qty-label">数量</span>
        <QtyStepper v-model="qty" :max="maxQty" :disabled="soldOut" />
        <span class="qty-total" data-testid="qty-total">小计 {{ totalPrice }}</span>
      </section>

      <section class="m-section">
        <h3 class="m-section-title">商品介绍</h3>
        <p class="muted" data-testid="detail-description">{{ product.description }}</p>
        <h3 class="m-section-title">规格参数</h3>
        <table class="spec-table m-spec" data-testid="spec-table">
          <tbody>
            <tr v-for="s in product.specs" :key="s.label">
              <th>{{ s.label }}</th>
              <td>{{ s.value }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 底部固定操作栏 -->
      <div class="m-action-bar" data-testid="m-action-bar">
        <router-link to="/m/cart" class="m-action-cart" data-testid="m-go-cart">购物车</router-link>
        <button class="btn btn-outline" data-testid="add-to-cart" :disabled="soldOut || adding" @click="addToCart">
          {{ soldOut ? '已售罄' : '加入购物车' }}
        </button>
        <button class="btn btn-primary" data-testid="buy-now" :disabled="soldOut" @click="buyNow">立即购买</button>
      </div>
    </template>
  </div>
</template>
