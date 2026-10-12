<script setup lang="ts">
/** 数量步进器：± 按钮与直接输入（覆盖点击与填值两类步骤），取值夹在 [1, max]。 */
const props = withDefaults(defineProps<{ modelValue: number; max?: number; disabled?: boolean; testidPrefix?: string }>(), {
  max: 99,
  disabled: false,
  testidPrefix: 'qty',
});
const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

function clamp(n: number) {
  return Math.min(Math.max(1, props.max), Math.max(1, Math.floor(Number.isFinite(n) ? n : 1)));
}

function set(n: number) {
  emit('update:modelValue', clamp(n));
}
</script>

<template>
  <div class="qty-control" :data-testid="`${testidPrefix}-control`">
    <button
      class="qty-btn"
      :data-testid="`${testidPrefix}-minus`"
      :disabled="disabled || modelValue <= 1"
      aria-label="减少数量"
      @click="set(modelValue - 1)"
    >
      −
    </button>
    <input
      class="qty-input"
      :data-testid="`${testidPrefix}-input`"
      type="number"
      min="1"
      :max="max"
      :value="modelValue"
      :disabled="disabled"
      aria-label="商品数量"
      @change="set(Number(($event.target as HTMLInputElement).value))"
    />
    <button
      class="qty-btn"
      :data-testid="`${testidPrefix}-plus`"
      :disabled="disabled || modelValue >= max"
      aria-label="增加数量"
      @click="set(modelValue + 1)"
    >
      ＋
    </button>
  </div>
</template>
