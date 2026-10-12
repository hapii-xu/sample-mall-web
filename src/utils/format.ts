import type { OrderStatus, StockStatus } from '../api/types';

export function formatPrice(value: number): string {
  return `¥${Number(value).toFixed(2)}`;
}

/** 库存展示文案（REQ-012）：有货 / 仅剩 N 件 / 已售罄。 */
export function stockText(status: StockStatus, stock: number): string {
  if (status === 'SOLD_OUT') return '已售罄';
  if (status === 'LOW_STOCK') return `仅剩 ${stock} 件`;
  return '有货';
}

export const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  PENDING_PAYMENT: '待支付',
  PAID: '已支付',
  CANCELLED: '已取消',
};

export function formatTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 运费规则提示（与后端 Pricing 一致）：满 ¥99 包邮，否则 ¥10。 */
export const FREE_SHIPPING_THRESHOLD = 99;
