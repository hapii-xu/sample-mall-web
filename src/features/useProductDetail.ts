import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, ApiError } from '../api';
import type { ProductDetail } from '../api/types';
import { useAuth } from '../composables/auth';
import { useCart } from '../composables/cart';
import { useConfirm } from '../composables/confirm';
import { useToast } from '../composables/toast';
import { formatPrice } from '../utils/format';
import { useLinks } from './links';

/**
 * 商品详情（REQ-013 / REQ-014 / REQ-020 / REQ-040）。
 * 加载态至少保持 400ms：给自动化留出「等待骨架消失」的练习场景。
 */
export function useProductDetail() {
  const route = useRoute();
  const router = useRouter();
  const { link } = useLinks();
  const { isLoggedIn } = useAuth();
  const cart = useCart();
  const { confirm } = useConfirm();
  const { show } = useToast();

  const loading = ref(true);
  const product = ref<ProductDetail | null>(null);
  const qty = ref(1);
  const adding = ref(false);

  onMounted(async () => {
    const minDelay = new Promise((r) => setTimeout(r, 400));
    try {
      product.value = await api.product(String(route.params.id));
    } catch (e) {
      product.value = null;
      if (!(e instanceof ApiError && e.code === 'PRODUCT_NOT_FOUND')) show(e instanceof ApiError ? e.message : '加载失败');
    }
    await minDelay;
    loading.value = false;
  });

  const soldOut = computed(() => product.value?.stockStatus === 'SOLD_OUT');
  const maxQty = computed(() => Math.max(1, Math.min(99, product.value?.stock ?? 1)));
  const totalPrice = computed(() => (product.value ? formatPrice(product.value.price * qty.value) : ''));

  /** 登录墙：未登录 → toast「请先登录」并跳登录页，登录后回跳当前详情页。 */
  function requireLogin(): boolean {
    if (isLoggedIn.value) return true;
    show('请先登录');
    router.push({ path: link('/login'), query: { redirect: route.fullPath } });
    return false;
  }

  async function addToCart() {
    if (!product.value || !requireLogin()) return;
    const ok = await confirm({
      title: '确认加入购物车',
      message: `${product.value.name} × ${qty.value}，小计 ${totalPrice.value}`,
      okText: '确认加入',
    });
    if (!ok) return;
    adding.value = true;
    try {
      await cart.add(product.value.id, qty.value);
      show('已加入购物车');
    } catch (e) {
      show(e instanceof ApiError ? e.message : '加入购物车失败');
    } finally {
      adding.value = false;
    }
  }

  function buyNow() {
    if (!product.value || !requireLogin()) return;
    router.push({ path: link('/checkout'), query: { source: 'direct', productId: product.value.id, qty: String(qty.value) } });
  }

  return { loading, product, qty, maxQty, soldOut, totalPrice, adding, addToCart, buyNow };
}
