<template>
  <div
    :class="[
      'flex w-full gap-4 py-6 px-4 animate-fade-in',
      isUser ? 'bg-white' : 'bg-gray-50',
    ]"
  >
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <div
        :class="[
          'w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary-500' : 'bg-green-500',
        ]"
      >
        <User v-if="isUser" class="w-5 h-5 text-white" />
        <Bot v-else class="w-5 h-5 text-white" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 space-y-2 overflow-hidden min-w-0">
      <div class="font-medium text-sm text-gray-900">
        {{ isUser ? 'You' : 'AI Assistant' }}
      </div>

      <div class="prose prose-sm max-w-none">
        <MarkdownRenderer
          :content="message.content"
          :is-streaming="message.isStreaming"
        />
      </div>

      <!-- Error message -->
      <div
        v-if="message.error"
        class="flex items-center gap-2 text-red-600 text-sm mt-2"
      >
        <AlertCircle class="w-4 h-4" />
        <span>发生错误</span>
      </div>

      <!-- Actions -->
      <div
        v-if="!isUser && !message.isStreaming"
        class="flex gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity"
        :class="{ 'opacity-100': showActions }"
        @mouseenter="showActions = true"
        @mouseleave="showActions = false"
      >
        <button
          class="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          title="复制"
          @click="copyContent"
        >
          <Check v-if="copied" class="w-4 h-4 text-green-600" />
          <Copy v-else class="w-4 h-4 text-gray-500" />
        </button>
        <button
          class="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          title="重新生成"
          @click="regenerate"
        >
          <RefreshCw class="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { User, Bot, Copy, RefreshCw, Check, AlertCircle } from 'lucide-vue-next';
import type { Message } from '@/types/chat';
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue';
import { copyToClipboard } from '@/utils/helpers';

interface Props {
  message: Message;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'regenerate'): void;
}>();

const isUser = computed(() => props.message.role === 'user');
const copied = ref(false);
const showActions = ref(false);

const copyContent = async () => {
  const success = await copyToClipboard(props.message.content);
  if (success) {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

const regenerate = () => {
  emit('regenerate');
};
</script>

<style scoped>
.group:hover .opacity-0 {
  opacity: 1;
}
</style>
