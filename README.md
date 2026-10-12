# sample-mall-web

Sample Mall（示例商城 · 山野茶铺）前端：Vue 3 + Vite + TypeScript，**一个工程两个端**：

| 端 | 地址 | 平台系统类型 |
|---|---|---|
| PC 官网 | `http://localhost:8898/` | `web` |
| 移动 H5 | `http://localhost:8898/m` | `mobile_web` |

移动设备 UA 访问 PC 地址会自动跳到对应 `/m` 地址；页脚「电脑版 / 手机版」可手动切换（偏好存 localStorage）。桌面浏览器直接打开 `/m` 不跳转，便于调试。

后端见 [sample-mall-server](https://github.com/hapii-xu/sample-mall-server)（网关 :8080），需求见 [sample-mall-docs](https://github.com/hapii-xu/sample-mall-docs)。

## 启动

```bash
pnpm install
pnpm dev            # http://localhost:8898 ，/api 代理到 http://localhost:8080（VITE_API_TARGET 可改）
pnpm build          # vue-tsc 类型检查 + 构建
```

先启动后端：`sample-mall-server/scripts/start-all.sh`。重启后端即重置数据。

## 页面（v0.1）

| PC | H5 | 页面 | 登录 |
|---|---|---|---|
| `/` | `/m` | 首页：横幅、公告、分类筛选、商品列表 | |
| `/product/:id` | `/m/product/:id` | 商品详情：价格、库存、数量、加购、立即购买 | |
| `/login` | `/m/login` | 登录（支持 `?redirect=` 回跳） | |
| `/cart` | `/m/cart` | 购物车 | ✓ |
| `/checkout` | `/m/checkout` | 确认订单（`?source=cart` 或 `?source=direct&productId=&qty=`） | ✓ |
| `/orders` | `/m/orders` | 我的订单（状态筛选） | ✓ |
| `/orders/:orderNo` | `/m/orders/:orderNo` | 订单详情、支付、取消 | ✓ |
| — | `/m/me` | 我的 | |

测试账号：`demo / tapestry2026`（另有 `demo2`）。

## 自动化友好约定

- 交互与断言元素均带语义化 `data-testid`，**两端同一语义使用同一 testid**（如 `add-to-cart`、`cart-badge`、`login-error`、`order-status`），用例在 web / mobile_web 间可复用。
- 列表项带业务键：`product-card-<id>`、`cart-item-<productId>`、`order-card-<orderNo>`、`cart-qty-<productId>-plus`。
- 关键文案固定（「已加入购物车」「请先登录」「用户名或密码错误」「手机号格式不正确」「下单成功」「支付成功」「订单已取消」）。
- 内建等待场景：详情页骨架屏至少 400ms（`detail-skeleton`）；登录按钮至少 500ms「登录中…」。
- 确认操作统一用自定义弹窗：`confirm-modal` / `confirm-summary` / `confirm-ok` / `confirm-cancel`。

## 目录

```
src/
  api/          fetch 封装与接口定义（统一解包 {code,message,data}）
  composables/  登录态、购物车、toast、确认框（全局单例）
  features/     两端共用的页面逻辑（目录、详情、登录、购物车、结算、订单）
  layouts/      DesktopLayout（顶栏 + 页脚） / MobileLayout（标题栏 + 底部 Tab）
  pages/desktop pages/mobile   两端各自的模板
```

> 本工程由 Tapestry 平台仓库中的 `apps/demo-vue-shop`（纯前端被测站点）演进而来，商品目录与 testid 约定保持一致。
