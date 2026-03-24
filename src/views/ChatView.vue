<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar
      :conversations="chatStore.conversations"
      :current-id="chatStore.currentConversationId"
      :is-open="isSidebarOpen"
      @select="handleSelectConversation"
      @create="handleCreateConversation"
      @delete-conversation="handleDeleteConversation"
      @close="isSidebarOpen = false"
    />

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col h-full min-w-0">
      <!-- Header -->
      <Header
        :title="chatStore.currentConversation?.title || 'AI Chat'"
        :show-clear="chatStore.currentMessages.length > 0"
        @toggle-sidebar="isSidebarOpen = true"
        @clear="handleClear"
      />

      <!-- Messages -->
      <ChatList
        ref="chatListRef"
        :messages="chatStore.currentMessages"
        @regenerate="handleRegenerate"
        @scroll="handleScroll"
      />

      <!-- Scroll to bottom button -->
      <button
        v-if="!isAtBottom && chatStore.currentMessages.length > 0"
        class="fixed bottom-28 right-8 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-all z-10"
        @click="scrollToBottom"
      >
        <ChevronDown class="w-5 h-5 text-gray-600" />
      </button>

      <!-- Input -->
      <ChatInput
        v-model="inputMessage"
        :is-generating="chatStore.isGenerating"
        @send="handleSend"
        @stop="handleStop"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { useChatStore } from '@/stores/chat';
import { useChat } from '@/composables/useChat';
import Sidebar from '@/components/layout/Sidebar.vue';
import Header from '@/components/layout/Header.vue';
import ChatList from '@/components/chat/ChatList.vue';
import ChatInput from '@/components/chat/ChatInput.vue';

const chatStore = useChatStore();
const { sendMessage, stopGeneration, regenerateMessage } = useChat();

const isSidebarOpen = ref(false);
const isAtBottom = ref(true);
const inputMessage = ref('');
const chatListRef = ref<InstanceType<typeof ChatList>>();

// Handle sidebar on mobile
const handleSelectConversation = (id: string) => {
  chatStore.selectConversation(id);
};

const handleCreateConversation = () => {
  chatStore.createConversation();
};

const handleDeleteConversation = (id: string) => {
  chatStore.deleteConversation(id);
};

const handleClear = () => {
  if (chatStore.currentConversationId) {
    if (confirm('确定要清空当前对话的所有消息吗？')) {
      chatStore.clearMessages(chatStore.currentConversationId);
    }
  }
};

const handleSend = async (content: string) => {
  await sendMessage(content);
  isAtBottom.value = true;
};

const handleStop = () => {
  stopGeneration();
};

const handleRegenerate = () => {
  regenerateMessage();
};

const handleScroll = () => {
  // Update scroll position tracking
  const container = document.querySelector('.overflow-y-auto');
  if (container) {
    const { scrollTop, scrollHeight, clientHeight } = container;
    isAtBottom.value = scrollHeight - scrollTop - clientHeight < 100;
  }
};

const scrollToBottom = () => {
  const container = document.querySelector('.overflow-y-auto');
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
    isAtBottom.value = true;
  }
};

// Auto scroll to bottom on new messages
watch(
  () => chatStore.currentMessages.length,
  async () => {
    if (isAtBottom.value) {
      await nextTick();
      scrollToBottom();
    }
  }
);
</script>
