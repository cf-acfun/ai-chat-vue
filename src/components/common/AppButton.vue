<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses[size],
      variantClasses[variant],
      {
        'opacity-50 cursor-not-allowed': disabled || loading,
        'rounded-lg': !circle,
        'rounded-full': circle,
      },
      customClass,
    ]"
    @click="handleClick"
  >
    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  circle?: boolean;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  circle: false,
  customClass: '',
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const variantClasses = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
};

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>
