import { onMounted, ref } from 'vue';
import { api, ApiError } from '../api';
import type { Category, ProductSummary } from '../api/types';

/** 首页商品目录 + 分类筛选（REQ-010 / REQ-011）。category 为空 = 全部。 */
export function useCatalog() {
  const categories = ref<Category[]>([]);
  const products = ref<ProductSummary[]>([]);
  const active = ref('');
  const loading = ref(true);
  const error = ref('');

  async function load(category = active.value) {
    active.value = category;
    loading.value = true;
    error.value = '';
    try {
      products.value = await api.products(category || undefined);
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : '加载失败';
      products.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    api.categories().then((c) => (categories.value = c)).catch(() => {});
    await load('');
  });

  return { categories, products, active, loading, error, select: load };
}
