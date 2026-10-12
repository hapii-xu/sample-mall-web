<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useCatalog } from '../../features/useCatalog';
import { setViewPref, toDesktopPath } from '../../utils/device';
import { formatPrice, stockText } from '../../utils/format';

const route = useRoute();
const router = useRouter();
const { categories, products, active, loading, error, select } = useCatalog();

function switchToDesktop() {
  setViewPref('desktop');
  router.push(toDesktopPath(route.fullPath));
}
</script>

<template>
  <div class="m-home">
    <section class="m-hero" data-testid="hero">
      <h2 class="m-hero-title" data-testid="hero-title">来自山野的一杯好茶</h2>
      <p class="m-hero-sub" data-testid="hero-subtitle">六款精选茶品 · 产地直发 · 满 ¥99 包邮</p>
    </section>

    <div class="m-notice" data-testid="notice-bar">📢 茉莉白茶本季已售罄，下季预售预计 12 月开放。</div>

    <div class="m-chips" data-testid="category-tabs">
      <button class="m-chip" :class="{ active: active === '' }" data-testid="category-all" @click="select('')">全部</button>
      <button
        v-for="c in categories"
        :key="c.code"
        class="m-chip"
        :class="{ active: active === c.code }"
        :data-testid="`category-${c.code}`"
        @click="select(c.code)"
      >
        {{ c.name }}
      </button>
    </div>

    <p class="m-count" data-testid="product-count">共 {{ products.length }} 款商品</p>

    <p v-if="error" class="field-error m-pad" data-testid="product-error">{{ error }}</p>
    <p v-else-if="loading" class="empty-text" data-testid="product-loading">加载中…</p>
    <p v-else-if="products.length === 0" class="empty-text" data-testid="product-empty">该分类暂无商品</p>
    <div v-else class="m-grid">
      <router-link
        v-for="p in products"
        :key="p.id"
        :to="`/m/product/${p.id}`"
        class="m-card"
        :data-testid="`product-card-${p.id}`"
      >
        <div class="m-card-swatch" :style="{ background: p.swatch }">
          <span v-if="p.originalPrice" class="card-badge" data-testid="discount-badge">限时特惠</span>
          <span v-else-if="p.stockStatus === 'SOLD_OUT'" class="card-badge card-badge-muted" data-testid="soldout-badge">已售罄</span>
        </div>
        <div class="m-card-body">
          <h3 class="m-card-name" :data-testid="`product-name-${p.id}`">{{ p.name }}</h3>
          <div class="m-card-meta">
            <span class="card-price" :data-testid="`product-price-${p.id}`">{{ formatPrice(p.price) }}</span>
            <span class="card-stock" :data-testid="`product-stock-${p.id}`">{{ stockText(p.stockStatus, p.stock) }}</span>
          </div>
        </div>
      </router-link>
    </div>

    <p class="m-footer" data-testid="site-footer">
      山野茶铺 · Sample Mall ·
      <a href="javascript:void(0)" data-testid="switch-desktop" @click="switchToDesktop">电脑版</a>
    </p>
  </div>
</template>
