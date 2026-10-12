import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, ApiError } from '../api';
import type { CheckoutSource, OrderPreview } from '../api/types';
import { useAuth } from '../composables/auth';
import { useCart } from '../composables/cart';
import { useToast } from '../composables/toast';
import { useLinks } from './links';

/**
 * 结算页（REQ-041 / REQ-042 / REQ-043）。
 * 来源：?source=cart（购物车整单）或 ?source=direct&productId=&qty=（立即购买）。
 * 收货信息前端校验文案与后端一致；库存不足等后端错误以 toast 展示。
 */
export function useCheckout() {
  const route = useRoute();
  const router = useRouter();
  const { link } = useLinks();
  const { user } = useAuth();
  const { refresh: refreshCart } = useCart();
  const { show } = useToast();

  const source = computed<CheckoutSource>(() =>
    route.query.source === 'direct'
      ? {
          source: 'DIRECT',
          items: [{ productId: String(route.query.productId ?? ''), qty: Number(route.query.qty ?? 1) || 1 }],
        }
      : { source: 'CART' },
  );

  const preview = ref<OrderPreview | null>(null);
  const loading = ref(true);
  const loadError = ref('');
  const submitting = ref(false);

  const form = reactive({ receiverName: '', receiverPhone: user.value?.phone ?? '', receiverAddress: '', remark: '' });
  const errors = reactive<Record<'receiverName' | 'receiverPhone' | 'receiverAddress', string>>({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
  });

  onMounted(async () => {
    try {
      preview.value = await api.previewOrder(source.value);
    } catch (e) {
      loadError.value = e instanceof ApiError ? e.message : '加载失败';
    } finally {
      loading.value = false;
    }
  });

  function validate(): boolean {
    errors.receiverName = form.receiverName.trim() ? '' : '请填写收货人';
    errors.receiverPhone = !form.receiverPhone.trim()
      ? '请填写手机号'
      : /^1\d{10}$/.test(form.receiverPhone.trim())
        ? ''
        : '手机号格式不正确';
    errors.receiverAddress = form.receiverAddress.trim() ? '' : '请填写收货地址';
    return !errors.receiverName && !errors.receiverPhone && !errors.receiverAddress;
  }

  async function submit() {
    if (!preview.value || !validate()) return;
    submitting.value = true;
    try {
      const order = await api.createOrder(source.value, {
        receiverName: form.receiverName.trim(),
        receiverPhone: form.receiverPhone.trim(),
        receiverAddress: form.receiverAddress.trim(),
        remark: form.remark.trim() || undefined,
      });
      await refreshCart();
      show('下单成功');
      router.replace(link(`/orders/${order.orderNo}`));
    } catch (e) {
      show(e instanceof ApiError ? e.message : '下单失败');
    } finally {
      submitting.value = false;
    }
  }

  return { preview, loading, loadError, form, errors, submitting, submit };
}
