import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api, ApiError } from '../api';
import type { Order, OrderStatus } from '../api/types';
import { useConfirm } from '../composables/confirm';
import { useToast } from '../composables/toast';

export const ORDER_TABS: { key: '' | OrderStatus; label: string }[] = [
  { key: '', label: '全部' },
  { key: 'PENDING_PAYMENT', label: '待支付' },
  { key: 'PAID', label: '已支付' },
  { key: 'CANCELLED', label: '已取消' },
];

/** 支付 / 取消（REQ-044 / REQ-052），两端列表与详情共用。返回更新后的订单，失败返回 null。 */
export function useOrderActions() {
  const { confirm } = useConfirm();
  const { show } = useToast();

  async function pay(order: Order): Promise<Order | null> {
    const ok = await confirm({
      title: '确认支付',
      message: `订单 ${order.orderNo} 应付 ¥${order.payAmount.toFixed(2)}（演示环境，模拟支付）`,
      okText: '确认支付',
    });
    if (!ok) return null;
    try {
      const updated = await api.payOrder(order.orderNo);
      show('支付成功');
      return updated;
    } catch (e) {
      show(e instanceof ApiError ? e.message : '支付失败');
      return null;
    }
  }

  async function cancel(order: Order): Promise<Order | null> {
    const ok = await confirm({ title: '取消订单', message: `确定取消订单 ${order.orderNo} 吗？`, okText: '取消订单', cancelText: '再想想' });
    if (!ok) return null;
    try {
      const updated = await api.cancelOrder(order.orderNo);
      show('订单已取消');
      return updated;
    } catch (e) {
      show(e instanceof ApiError ? e.message : '取消失败');
      return null;
    }
  }

  return { pay, cancel };
}

/** 我的订单（REQ-050）：状态页签筛选，按下单时间倒序。 */
export function useOrderList() {
  const route = useRoute();
  const status = ref<'' | OrderStatus>((route.query.status as OrderStatus) || '');
  const orders = ref<Order[]>([]);
  const loading = ref(true);
  const actions = useOrderActions();

  async function load() {
    loading.value = true;
    try {
      orders.value = await api.orders(status.value || undefined);
    } catch {
      orders.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);
  watch(status, load);

  async function pay(order: Order) {
    if (await actions.pay(order)) await load();
  }

  async function cancel(order: Order) {
    if (await actions.cancel(order)) await load();
  }

  return { status, orders, loading, pay, cancel };
}

/** 订单详情（REQ-051）。 */
export function useOrderDetail() {
  const route = useRoute();
  const order = ref<Order | null>(null);
  const loading = ref(true);
  const actions = useOrderActions();

  onMounted(async () => {
    try {
      order.value = await api.order(String(route.params.orderNo));
    } catch {
      order.value = null;
    } finally {
      loading.value = false;
    }
  });

  async function pay() {
    if (!order.value) return;
    order.value = (await actions.pay(order.value)) ?? order.value;
  }

  async function cancel() {
    if (!order.value) return;
    order.value = (await actions.cancel(order.value)) ?? order.value;
  }

  return { order, loading, pay, cancel };
}
