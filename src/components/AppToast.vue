<script setup lang="ts">
import { useToast } from '../composables/toast';

const { message } = useToast();
</script>

<template>
  <transition name="toast-fade">
    <div v-if="message" class="app-toast" data-testid="toast" role="status">
      {{ message }}
    </div>
  </transition>
</template>
