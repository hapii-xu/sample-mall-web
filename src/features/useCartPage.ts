import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ApiError } from '../api';
import { useCart } from '../composables/cart';
import { useConfirm } from '../composables/confirm';
import { useToast } from '../composables/toast';
import { useLinks } from './links';

/** 购物车页（REQ-021 / REQ-022）：改数量、删除、清空、去结算。 */
export function useCartPage() {
  const router = useRouter();
  const { link } = useLinks();
  const { cart, refresh, update, remove, clear } = useCart();
  const { confirm } = useConfirm();
  const { show } = useToast();
  const loading = ref(true);

  onMounted(async () => {
    await refresh();
    loading.value = false;
  });

  const items = computed(() => cart.value?.items ?? []);
  const availableCount = computed(() => items.value.filter((i) => i.available).length);

  async function guard(op: () => Promise<unknown>, okText?: string) {
    try {
      await op();
      if (okText) show(okText);
    } catch (e) {
      show(e instanceof ApiError ? e.message : '操作失败');
    }
  }

  async function changeQty(productId: string, qty: number) {
    await guard(() => update(productId, qty));
  }

  async function removeItem(productId: string, name: string) {
    const ok = await confirm({ title: '删除商品', message: `确定从购物车删除「${name}」吗？`, okText: '删除' });
    if (ok) await guard(() => remove(productId), '已删除');
  }

  async function clearAll() {
    const ok = await confirm({ title: '清空购物车', message: '确定清空购物车中的全部商品吗？', okText: '清空' });
    if (ok) await guard(() => clear(), '购物车已清空');
  }

  function checkout() {
    if (availableCount.value === 0) {
      show('购物车中没有可结算的商品');
      return;
    }
    router.push({ path: link('/checkout'), query: { source: 'cart' } });
  }

  return { cart, items, loading, availableCount, changeQty, removeItem, clearAll, checkout };
}
