<script setup lang="ts">
import { useCatalog } from '../../features/useCatalog';
import { formatPrice, stockText } from '../../utils/format';

const { categories, products, active, loading, error, select } = useCatalog();
</script>

<template>
  <div class="home-page">
    <!-- 首屏横幅：主标题/副标题/行动按钮均为固定文案，可作页面就绪锚点 -->
    <section class="hero" data-testid="hero">
      <h1 class="hero-title" data-testid="hero-title">来自山野的一杯好茶</h1>
      <p class="hero-subtitle" data-testid="hero-subtitle">六款精选茶品 · 产地直发 · 满 ¥99 包邮</p>
      <a href="#product-grid" class="btn btn-primary btn-lg" data-testid="hero-cta">浏览全部茶品</a>
    </section>

    <!-- 公告条：固定文案，页面级断言的补充锚点 -->
    <div class="notice-bar" data-testid="notice-bar">📢 公告：茉莉白茶本季已售罄，下季预售预计 12 月开放。</div>

    <section id="product-grid" class="product-section">
      <div class="section-head">
        <h2 class="section-title" data-testid="section-title">精选茶品</h2>
        <p class="section-count" data-testid="product-count">共 {{ products.length }} 款商品</p>
      </div>

      <!-- 分类筛选（REQ-011） -->
      <div class="category-tabs" data-testid="category-tabs">
        <button
          class="category-tab"
          :class="{ active: active === '' }"
          data-testid="category-all"
          @click="select('')"
        >
          全部
        </button>
        <button
          v-for="c in categories"
          :key="c.code"
          class="category-tab"
          :class="{ active: active === c.code }"
          :data-testid="`category-${c.code}`"
          @click="select(c.code)"
        >
          {{ c.name }}
        </button>
      </div>

      <p v-if="error" class="field-error" data-testid="product-error">{{ error }}</p>
      <div v-else-if="loading" class="product-grid" data-testid="product-loading">
        <div v-for="n in 3" :key="n" class="product-card skeleton-card"></div>
      </div>
      <p v-else-if="products.length === 0" class="empty-text" data-testid="product-empty">该分类暂无商品</p>
      <div v-else class="product-grid">
        <article v-for="p in products" :key="p.id" class="product-card" :data-testid="`product-card-${p.id}`">
          <router-link :to="`/product/${p.id}`" class="card-link" :data-testid="`card-link-${p.id}`">
            <div class="card-swatch" :style="{ background: p.swatch }">
              <span v-if="p.originalPrice" class="card-badge" data-testid="discount-badge">限时特惠</span>
              <span v-else-if="p.stockStatus === 'SOLD_OUT'" class="card-badge card-badge-muted" data-testid="soldout-badge">
                已售罄
              </span>
            </div>
            <div class="card-body">
              <h3 class="card-name" :data-testid="`product-name-${p.id}`">{{ p.name }}</h3>
              <p class="card-tagline">{{ p.tagline }}</p>
              <div class="card-meta">
                <span class="card-price" :data-testid="`product-price-${p.id}`">{{ formatPrice(p.price) }}</span>
                <span v-if="p.originalPrice" class="card-price-original">{{ formatPrice(p.originalPrice) }}</span>
                <span class="card-stock" :data-testid="`product-stock-${p.id}`">{{ stockText(p.stockStatus, p.stock) }}</span>
              </div>
            </div>
          </router-link>
        </article>
      </div>
    </section>
  </div>
</template>
