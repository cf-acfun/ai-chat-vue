<template>
  <div ref="scrollContainer" class="flex-1 overflow-y-auto" @scroll="handleScroll">
    <!-- Empty State -->
    <div
      v-if="props.messages.length === 0"
      class="flex items-center justify-center h-full min-h-[400px]"
    >
      <div class="text-center text-gray-400">
        <Bot class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-2xl font-semibold mb-2 text-gray-600">开始新的对话</h2>
        <p class="text-gray-500">输入你的问题，AI 助手将为你提供帮助</p>
      </div>
    </div>

    <!-- Message List -->
    <template v-else>
      <ChatMessage
        v-for="message in props.messages"
        :key="message.id"
        :message="message"
        @regenerate="handleRegenerate"
      />
      <div ref="bottomRef" class="h-4" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Bot } from 'lucide-vue-next';
import type { Message } from '@/types/chat';
import ChatMessage from './ChatMessage.vue';

interface Props {
  messages: Message[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'regenerate'): void;
  (e: 'scroll', event: Event): void;
}>();

const scrollContainer = ref<HTMLElement>();
const bottomRef = ref<HTMLElement>();
const shouldAutoScroll = ref(true);

// Auto scroll to bottom when new messages arrive
watch(
  () => props.messages.length,
  async () => {
    if (shouldAutoScroll.value) {
      await nextTick();
      scrollToBottom();
    }
  }
);

// Also scroll when the last message content changes (streaming)
watch(
  () => props.messages[props.messages.length - 1]?.content,
  async () => {
    if (shouldAutoScroll.value) {
      await nextTick();
      scrollToBottom();
    }
  }
);

const scrollToBottom = () => {
  bottomRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const handleScroll = (event: Event) => {
  emit('scroll', event);
  // Check if user has scrolled up
  const target = event.target as HTMLElement;
  const isAtBottom =
    target.scrollHeight - target.scrollTop - target.clientHeight < 100;
  shouldAutoScroll.value = isAtBottom;
};

const handleRegenerate = () => {
  emit('regenerate');
};

// Expose scrollToBottom method
defineExpose({
  scrollToBottom,
});
</script>
