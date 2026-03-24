<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeOnBackdrop && close()"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Modal content -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            class="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          >
            <!-- Header -->
            <div
              v-if="title || $slots.header"
              class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
            >
              <slot name="header">
                <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
              </slot>
              <button
                v-if="showClose"
                class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                @click="close"
              >
                <X class="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-4 overflow-y-auto">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50"
            >
              <slot name="footer" :close="close" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

interface Props {
  modelValue: boolean;
  title?: string;
  showClose?: boolean;
  closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showClose: true,
  closeOnBackdrop: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>
