import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Conversation, Message } from '@/types/chat';
import { generateId } from '@/utils/helpers';

export const useChatStore = defineStore('chat', () => {
  // State
  const conversations = ref<Conversation[]>([]);
  const currentConversationId = ref<string>('');
  const isGenerating = ref(false);

  // Getters
  const currentConversation = computed(() =>
    conversations.value.find((c) => c.id === currentConversationId.value)
  );

  const currentMessages = computed(() => currentConversation.value?.messages || []);

  // Actions
  const createConversation = (): string => {
    const newConversation: Conversation = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    conversations.value.unshift(newConversation);
    currentConversationId.value = newConversation.id;
    return newConversation.id;
  };

  const addMessage = (
    conversationId: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): string | undefined => {
    const conversation = conversations.value.find((c) => c.id === conversationId);
    if (!conversation) return;

    const fullMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };

    conversation.messages.push(fullMessage);
    conversation.updatedAt = Date.now();

    // Auto-update title (first user message)
    if (conversation.messages.length === 1 && message.role === 'user') {
      conversation.title =
        message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '');
    }

    return fullMessage.id;
  };

  const updateMessage = (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>
  ): void => {
    const conversation = conversations.value.find((c) => c.id === conversationId);
    const message = conversation?.messages.find((m) => m.id === messageId);
    if (message) {
      Object.assign(message, updates);
    }
  };

  const deleteConversation = (id: string): void => {
    const index = conversations.value.findIndex((c) => c.id === id);
    if (index > -1) {
      conversations.value.splice(index, 1);
      if (currentConversationId.value === id) {
        currentConversationId.value = conversations.value[0]?.id || '';
      }
    }
  };

  const clearMessages = (conversationId: string): void => {
    const conversation = conversations.value.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.messages = [];
      conversation.updatedAt = Date.now();
    }
  };

  const selectConversation = (id: string): void => {
    currentConversationId.value = id;
  };

  const setIsGenerating = (value: boolean): void => {
    isGenerating.value = value;
  };

  return {
    // State
    conversations,
    currentConversationId,
    isGenerating,
    // Getters
    currentConversation,
    currentMessages,
    // Actions
    createConversation,
    addMessage,
    updateMessage,
    deleteConversation,
    clearMessages,
    selectConversation,
    setIsGenerating,
  };
});
