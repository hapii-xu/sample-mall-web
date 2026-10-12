import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ApiError } from '../api';
import { useAuth } from '../composables/auth';
import { useToast } from '../composables/toast';
import { useLinks } from './links';

/**
 * 登录表单（REQ-030），提交语义固定、供用例断言：
 * - 空字段 → 行内「请输入用户名」/「请输入密码」（不发请求）
 * - 错误口令 → 「用户名或密码错误」
 * - 成功 → toast「登录成功」，按 redirect 回跳（默认首页）
 * 提交按钮至少保持 500ms「登录中…」，覆盖按钮 loading 态等待场景。
 */
export function useLoginForm() {
  const route = useRoute();
  const router = useRouter();
  const { link } = useLinks();
  const { login } = useAuth();
  const { show } = useToast();

  const username = ref('');
  const password = ref('');
  const error = ref('');
  const submitting = ref(false);

  async function submit() {
    error.value = '';
    if (!username.value.trim()) {
      error.value = '请输入用户名';
      return;
    }
    if (!password.value) {
      error.value = '请输入密码';
      return;
    }
    submitting.value = true;
    const minDelay = new Promise((r) => setTimeout(r, 500));
    try {
      await login(username.value.trim(), password.value);
      await minDelay;
      show('登录成功');
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : link('/');
      router.push(redirect);
    } catch (e) {
      await minDelay;
      error.value = e instanceof ApiError ? e.message : '登录失败';
    } finally {
      submitting.value = false;
    }
  }

  return { username, password, error, submitting, submit };
}
