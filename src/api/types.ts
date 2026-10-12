/** 与 sample-mall-server 的响应视图一一对应。 */

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT';
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED';

export interface Category {
  code: string;
  name: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  categoryCode: string;
  swatch: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  stockStatus: StockStatus;
  tagline: string;
}

export interface ProductDetail extends ProductSummary {
  categoryName: string;
  origin: string;
  description: string;
  specs: { label: string; value: string }[];
}

export interface User {
  id: number;
  username: string;
  displayName: string;
  phone: string | null;
}

export interface LoginResult {
  token: string;
  expiresIn: number;
  user: User;
}

export interface CartLine {
  productId: string;
  name: string;
  swatch: string;
  price: number;
  qty: number;
  stock: number;
  stockStatus: StockStatus;
  subtotal: number;
  available: boolean;
  unavailableReason: string | null;
}

export interface Cart {
  items: CartLine[];
  totalCount: number;
  itemsAmount: number;
  shippingFee: number;
  payAmount: number;
}

export interface OrderLine {
  productId: string;
  productName: string;
  swatch: string;
  price: number;
  qty: number;
}

export interface OrderPreview {
  lines: OrderLine[];
  itemsAmount: number;
  shippingFee: number;
  payAmount: number;
}

export interface Order extends OrderPreview {
  orderNo: string;
  status: OrderStatus;
  totalCount: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  remark: string | null;
  createdAt: string;
  paidAt: string | null;
  cancelledAt: string | null;
}

/** 结算来源：购物车整单 / 详情页「立即购买」单品。 */
export type CheckoutSource = { source: 'CART' } | { source: 'DIRECT'; items: { productId: string; qty: number }[] };

export interface Receiver {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  remark?: string;
}
