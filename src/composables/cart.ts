import { computed, ref, watch } from 'vue';
import { api } from '../api';
import type { Cart } from '../api/types';
import { useAuth } from './auth';

/**
 * 购物车（服务端持久化，按用户隔离，REQ-020 / REQ-021）。
 * 头部 / 底部导航徽标 = 各条目数量之和，是加购流程的标准断言点。
 */
const cart = ref<Cart | null>(null);
const { isLoggedIn } = useAuth();

async function refresh() {
  if (!isLoggedIn.value) {
    cart.value = null;
    return;
  }
  try {
    cart.value = await api.cart();
  } catch {
    cart.value = null;
  }
}

watch(isLoggedIn, refresh, { immediate: true });

export function useCart() {
  async function run(op: Promise<Cart>) {
    cart.value = await op;
    return cart.value;
  }

  return {
    cart,
    totalCount: computed(() => cart.value?.totalCount ?? 0),
    refresh,
    add: (productId: string, qty: number) => run(api.addToCart(productId, qty)),
    update: (productId: string, qty: number) => run(api.updateCartItem(productId, qty)),
    remove: (productId: string) => run(api.removeCartItem(productId)),
    clear: () => run(api.clearCart()),
  };
}
