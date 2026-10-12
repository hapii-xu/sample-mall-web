import { http } from './http';
import type {
  Cart,
  Category,
  CheckoutSource,
  LoginResult,
  Order,
  OrderPreview,
  OrderStatus,
  ProductDetail,
  ProductSummary,
  Receiver,
  User,
} from './types';

export const api = {
  categories: () => http.get<Category[]>('/api/categories'),
  products: (category?: string) =>
    http.get<ProductSummary[]>('/api/products' + (category ? `?category=${encodeURIComponent(category)}` : '')),
  product: (id: string) => http.get<ProductDetail>(`/api/products/${encodeURIComponent(id)}`),

  login: (username: string, password: string) => http.post<LoginResult>('/api/auth/login', { username, password }),
  me: () => http.get<User>('/api/users/me'),

  cart: () => http.get<Cart>('/api/cart'),
  addToCart: (productId: string, qty: number) => http.post<Cart>('/api/cart/items', { productId, qty }),
  updateCartItem: (productId: string, qty: number) =>
    http.put<Cart>(`/api/cart/items/${encodeURIComponent(productId)}`, { qty }),
  removeCartItem: (productId: string) => http.del<Cart>(`/api/cart/items/${encodeURIComponent(productId)}`),
  clearCart: () => http.del<Cart>('/api/cart'),

  previewOrder: (src: CheckoutSource) => http.post<OrderPreview>('/api/orders/preview', src),
  createOrder: (src: CheckoutSource, receiver: Receiver) => http.post<Order>('/api/orders', { ...src, ...receiver }),
  orders: (status?: OrderStatus) => http.get<Order[]>('/api/orders' + (status ? `?status=${status}` : '')),
  order: (orderNo: string) => http.get<Order>(`/api/orders/${encodeURIComponent(orderNo)}`),
  payOrder: (orderNo: string) => http.post<Order>(`/api/orders/${encodeURIComponent(orderNo)}/pay`),
  cancelOrder: (orderNo: string) => http.post<Order>(`/api/orders/${encodeURIComponent(orderNo)}/cancel`),
};

export { ApiError } from './http';
export type * from './types';
