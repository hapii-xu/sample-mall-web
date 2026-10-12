import { ref } from 'vue';

/**
 * 自定义确认框（非原生 confirm，便于自动化定位）：await confirm({...}) 返回是否确认。
 * 渲染见 components/ConfirmDialog.vue（testid: confirm-modal / confirm-summary / confirm-ok / confirm-cancel）。
 */
export interface ConfirmOptions {
  title: string;
  message: string;
  okText?: string;
  cancelText?: string;
}

const current = ref<ConfirmOptions | null>(null);
let resolver: ((ok: boolean) => void) | null = null;

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    resolver?.(false);
    current.value = options;
    return new Promise((resolve) => {
      resolver = resolve;
    });
  }

  function settle(ok: boolean) {
    current.value = null;
    resolver?.(ok);
    resolver = null;
  }

  return { current, confirm, settle };
}
