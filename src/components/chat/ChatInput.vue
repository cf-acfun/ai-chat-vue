<template>
  <div class="border-t bg-white p-4">
    <div class="max-w-4xl mx-auto relative">
      <textarea
        v-model="input"
        :disabled="isGenerating"
        :placeholder="isGenerating ? 'AI 正在思考...' : '输入消息...'"
        :rows="rows"
        class="w-full resize-none rounded-xl border border-gray-300 pl-4 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-shadow"
        @keydown.enter.exact.prevent="handleSend"
        @keydown.enter.shift.exact="newLine"
        @input="autoResize"
      />

      <!-- Send/Stop Button -->
      <button
        v-if="!isGenerating"
        :disabled="!input.trim()"
        class="absolute right-3 bottom-3 p-2 bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 disabled:hover:bg-primary-600 transition-colors"
        @click="handleSend"
      >
        <Send class="w-4 h-4" />
      </button>

      <button
        v-else
        class="absolute right-3 bottom-3 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        @click="stopGeneration"
      >
        <Square class="w-4 h-4" />
      </button>
    </div>

    <div class="text-center mt-2 text-xs text-gray-500">
      按 <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">Enter</kbd> 发送，
      <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">Shift</kbd> +
      <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">Enter</kbd> 换行
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Send, Square } from 'lucide-vue-next';

interface Props {
  isGenerating: boolean;
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
});

const emit = defineEmits<{
  (e: 'send', content: string): void;
  (e: 'stop'): void;
  (e: 'update:modelValue', value: string): void;
}>();

const input = ref(props.modelValue);
const rows = ref(1);

// Sync with parent
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== input.value) {
      input.value = newVal;
    }
  }
);

watch(input, (newVal) => {
  emit('update:modelValue', newVal);
});

const handleSend = () => {
  if (!input.value.trim() || props.isGenerating) return;
  emit('send', input.value);
  input.value = '';
  rows.value = 1;
};

const stopGeneration = () => {
  emit('stop');
};

const newLine = () => {
  input.value += '\n';
};

const autoResize = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  const lines = target.value.split('\n').length;
  rows.value = Math.min(Math.max(lines, 1), 5);
};
</script>
