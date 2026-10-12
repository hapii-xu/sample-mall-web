import { computed, ref } from 'vue';
import { api } from '../api';
import { onUnauthorized, setToken } from '../api/http';
import type { User } from '../api/types';

/**
 * 登录态（全局单例，localStorage 持久化，REQ-030 ~ REQ-032）。
 * 测试账号：demo / tapestry2026（显示名「茶客_demo」）。
 * 令牌有效期 7 天；任何接口返回 401 时自动清除本地登录态。
 */
const USER_KEY = 'sample-mall.user';

function load(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

const user = ref<User | null>(load());

function clear() {
  user.value = null;
  setToken(null);
  localStorage.removeItem(USER_KEY);
}

onUnauthorized(clear);

export function useAuth() {
  async function login(username: string, password: string): Promise<User> {
    const result = await api.login(username, password);
    setToken(result.token);
    user.value = result.user;
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    return result.user;
  }

  return { user, isLoggedIn: computed(() => user.value !== null), login, logout: clear };
}
