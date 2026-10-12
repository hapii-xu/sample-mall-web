/**
 * 双端适配（REQ-001）：PC 官网挂在 /，移动 H5 挂在 /m。
 * - 移动设备 UA 访问 PC 地址时自动跳转到对应 /m 地址；
 * - 用户可在页脚手动切换「电脑版 / 手机版」，偏好存 localStorage，切换后不再自动跳转；
 * - PC 浏览器直接访问 /m 不做跳转（便于在桌面浏览器调试 H5）。
 */
const PREF_KEY = 'sample-mall.view';

export type ViewPref = 'desktop' | 'mobile';

export function isMobileUA(ua = navigator.userAgent): boolean {
  return /Android|iPhone|iPod|iPad|Mobile|HarmonyOS|MicroMessenger/i.test(ua);
}

export function getViewPref(): ViewPref | null {
  try {
    const v = localStorage.getItem(PREF_KEY);
    return v === 'desktop' || v === 'mobile' ? v : null;
  } catch {
    return null;
  }
}

export function setViewPref(pref: ViewPref) {
  localStorage.setItem(PREF_KEY, pref);
}

export function isMobilePath(path: string): boolean {
  return path === '/m' || path.startsWith('/m/');
}

/** PC 路径 → H5 路径 */
export function toMobilePath(fullPath: string): string {
  return fullPath === '/' ? '/m' : '/m' + fullPath;
}

/** H5 路径 → PC 路径（「我的」页在 PC 端对应「我的订单」） */
export function toDesktopPath(fullPath: string): string {
  const rest = fullPath.replace(/^\/m/, '') || '/';
  return rest.startsWith('/me') ? '/orders' : rest;
}
