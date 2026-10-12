<script setup lang="ts">
import QtyStepper from '../../components/QtyStepper.vue';
import { useProductDetail } from '../../features/useProductDetail';
import { formatPrice } from '../../utils/format';

const { loading, product, qty, maxQty, soldOut, totalPrice, adding, addToCart, buyNow } = useProductDetail();
</script>

<template>
  <div class="detail-page">
    <!-- 面包屑：返回首页的稳定锚点 -->
    <nav class="breadcrumb" data-testid="breadcrumb">
      <router-link to="/" data-testid="breadcrumb-home">首页</router-link>
      <span class="breadcrumb-sep">/</span>
      <span v-if="product" data-testid="breadcrumb-category">{{ product.categoryName }}</span>
      <span v-if="product" class="breadcrumb-sep">/</span>
      <span>商品详情</span>
    </nav>

    <!-- 加载骨架：自动化可等待其消失 -->
    <div v-if="loading" class="detail-skeleton" data-testid="detail-skeleton">
      <div class="skeleton-block skeleton-swatch"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line w-60"></div>
        <div class="skeleton-line w-90"></div>
        <div class="skeleton-line w-40"></div>
      </div>
    </div>

    <!-- 商品不存在：兜底态（REQ-014） -->
    <div v-else-if="!product" class="detail-empty" data-testid="detail-not-found">
      <p>商品不存在或已下架</p>
      <router-link to="/" class="btn btn-primary" data-testid="back-home-from-empty">返回首页</router-link>
    </div>

    <template v-else>
      <div class="detail-layout">
        <div class="detail-swatch" :style="{ background: product.swatch }">
          <span v-if="product.originalPrice" class="card-badge">限时特惠</span>
        </div>

        <div class="detail-info">
          <h1 class="detail-name" data-testid="detail-name">{{ product.name }}</h1>
          <p class="detail-tagline">{{ product.tagline }}</p>

          <div class="price-row" data-testid="detail-price-row">
            <span class="detail-price" data-testid="detail-price">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="card-price-original">{{ formatPrice(product.originalPrice) }}</span>
          </div>

          <ul class="fact-list">
            <li data-testid="detail-origin">产地：{{ product.origin }}</li>
            <li data-testid="detail-stock">库存：{{ soldOut ? '已售罄' : `剩 ${product.stock} 件` }}</li>
            <li data-testid="detail-shipping">运费：满 ¥99 包邮，不满收取 ¥10</li>
          </ul>

          <!-- 数量选择：上限 = min(99, 库存) -->
          <div class="qty-row">
            <span class="qty-label">数量</span>
            <QtyStepper v-model="qty" :max="maxQty" :disabled="soldOut" />
            <span class="qty-total" data-testid="qty-total">小计 {{ totalPrice }}</span>
          </div>

          <div class="action-row">
            <button
              class="btn btn-primary btn-lg"
              data-testid="add-to-cart"
              :disabled="soldOut || adding"
              @click="addToCart"
            >
              {{ soldOut ? '已售罄' : '加入购物车' }}
            </button>
            <button class="btn btn-outline btn-lg" data-testid="buy-now" :disabled="soldOut" @click="buyNow">
              立即购买
            </button>
          </div>
        </div>
      </div>

      <div class="detail-desc">
        <h2 class="section-title">商品介绍</h2>
        <p data-testid="detail-description">{{ product.description }}</p>
        <h2 class="section-title">规格参数</h2>
        <table class="spec-table" data-testid="spec-table">
          <tbody>
            <tr v-for="s in product.specs" :key="s.label">
              <th>{{ s.label }}</th>
              <td>{{ s.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
