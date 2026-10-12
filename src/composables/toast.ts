import { ref } from 'vue';

/**
 * 轻量 toast（全局单例）。文案 2.5s 后消失，
 * 供自动化断言（如「已加入购物车」）与等待消失场景使用。
 */
const message = ref('');
let timer: ReturnType<typeof setTimeout> | undefined;

export function useToast() {
  function show(text: string) {
    message.value = text;
    clearTimeout(timer);
    timer = setTimeout(() => {
      message.value = '';
    }, 2500);
  }
  return { message, show };
}
