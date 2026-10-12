<script setup lang="ts">
import { useLoginForm } from '../../features/useLoginForm';

const { username, password, error, submitting, submit } = useLoginForm();
</script>

<template>
  <div class="m-login" data-testid="login-card">
    <p class="m-login-welcome" data-testid="login-title">欢迎来到山野茶铺</p>
    <form @submit.prevent="submit">
      <label class="field">
        <span class="field-label">用户名</span>
        <input v-model="username" class="field-input" data-testid="login-username" type="text" placeholder="请输入用户名" autocomplete="username" />
      </label>
      <label class="field">
        <span class="field-label">密码</span>
        <input v-model="password" class="field-input" data-testid="login-password" type="password" placeholder="请输入密码" autocomplete="current-password" />
      </label>
      <p v-if="error" class="field-error" data-testid="login-error" role="alert">{{ error }}</p>
      <button class="btn btn-primary btn-lg btn-block" type="submit" data-testid="login-submit" :disabled="submitting">
        {{ submitting ? '登录中…' : '登 录' }}
      </button>
    </form>
    <div class="login-hint" data-testid="login-hint">演示账号：demo　密码：tapestry2026</div>
  </div>
</template>
