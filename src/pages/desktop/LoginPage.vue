<script setup lang="ts">
import { useLoginForm } from '../../features/useLoginForm';

const { username, password, error, submitting, submit } = useLoginForm();
</script>

<template>
  <div class="login-page">
    <div class="login-card" data-testid="login-card">
      <h1 class="login-title" data-testid="login-title">会员登录</h1>
      <p class="login-subtitle">登录后可加入购物车、下单并查看订单</p>

      <form class="login-form" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">用户名</span>
          <input
            v-model="username"
            class="field-input"
            data-testid="login-username"
            type="text"
            placeholder="请输入用户名"
            autocomplete="username"
          />
        </label>

        <label class="field">
          <span class="field-label">密码</span>
          <input
            v-model="password"
            class="field-input"
            data-testid="login-password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
        </label>

        <!-- 行内错误：固定文案，自动化的核心断言点之一 -->
        <p v-if="error" class="field-error" data-testid="login-error" role="alert">{{ error }}</p>

        <button class="btn btn-primary btn-lg btn-block" type="submit" data-testid="login-submit" :disabled="submitting">
          {{ submitting ? '登录中…' : '登 录' }}
        </button>
      </form>

      <!-- 测试账号提示：写在页面上，方便演示与录屏 -->
      <div class="login-hint" data-testid="login-hint">演示账号：demo　密码：tapestry2026</div>
    </div>
  </div>
</template>
