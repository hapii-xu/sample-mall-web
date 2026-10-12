<script setup lang="ts">
import { useConfirm } from '../composables/confirm';

const { current, settle } = useConfirm();
</script>

<template>
  <div v-if="current" class="modal-mask" data-testid="confirm-modal" @click.self="settle(false)">
    <div class="modal" role="dialog" :aria-label="current.title">
      <h3 class="modal-title" data-testid="confirm-title">{{ current.title }}</h3>
      <p class="modal-body" data-testid="confirm-summary">{{ current.message }}</p>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-testid="confirm-cancel" @click="settle(false)">
          {{ current.cancelText ?? '取消' }}
        </button>
        <button class="btn btn-primary" data-testid="confirm-ok" @click="settle(true)">
          {{ current.okText ?? '确定' }}
        </button>
      </div>
    </div>
  </div>
</template>
