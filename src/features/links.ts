import { useRoute } from 'vue-router';
import { isMobilePath } from '../utils/device';

/** 按当前所在端（PC / H5）生成站内链接：link('/cart') → '/cart' 或 '/m/cart'。 */
export function useLinks() {
  const route = useRoute();
  function link(path: string): string {
    const mobile = isMobilePath(route.path);
    if (!mobile) return path;
    return path === '/' ? '/m' : '/m' + path;
  }
  return { link };
}
