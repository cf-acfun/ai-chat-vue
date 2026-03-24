<template>
  <div class="relative group rounded-lg overflow-hidden my-4">
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-sm"
    >
      <span class="font-mono">{{ language || 'text' }}</span>
      <button
        class="flex items-center gap-1.5 hover:text-white transition-colors"
        @click="copyCode"
      >
        <Check v-if="copied" class="w-4 h-4" />
        <Copy v-else class="w-4 h-4" />
        <span class="text-xs">{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>

    <!-- Code -->
    <pre
      class="!m-0 !rounded-none !bg-gray-900 overflow-x-auto"
    ><code ref="codeEl" :class="`language-${language || 'text'}`">{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Copy, Check } from 'lucide-vue-next';
import hljs from 'highlight.js';

interface Props {
  code: string;
  language?: string;
}

const props = defineProps<Props>();

const codeEl = ref<HTMLElement>();
const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

onMounted(() => {
  if (codeEl.value) {
    hljs.highlightElement(codeEl.value);
  }
});
</script>
