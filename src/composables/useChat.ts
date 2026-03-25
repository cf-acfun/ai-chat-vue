import { ref } from 'vue';
import { useChatStore } from '@/stores/chat';
import { fetchChatStream } from '@/api/stream';
import type { Message } from '@/types/chat';

export function useChat() {
  const store = useChatStore();
  const error = ref<string | null>(null);
  const abortController = ref<AbortController | null>(null);

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || store.isGenerating) return;

    const conversationId = store.currentConversationId || store.createConversation();

    // Add user message
    store.addMessage(conversationId, {
      role: 'user',
      content: content.trim(),
    });

    // Add AI placeholder message
    const assistantMessageId = store.addMessage(conversationId, {
      role: 'assistant',
      content: '',
      isStreaming: true,
    });

    if (!assistantMessageId) {
      console.error('Failed to create assistant message');
      return;
    }

    store.setIsGenerating(true);
    error.value = null;

    try {
      abortController.value = new AbortController();

      await fetchChatStream(
        {
          messages: store.currentMessages.map((m: Message) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        },
        {
          signal: abortController.value.signal,
          onMessage: (chunk: string) => {
            store.updateMessage(conversationId, assistantMessageId, {
              content: chunk,
            });
          },
          onComplete: () => {
            store.updateMessage(conversationId, assistantMessageId, {
              isStreaming: false,
            });
            store.setIsGenerating(false);
          },
          onError: (err: Error) => {
            error.value = err.message;
            console.error('[DEBUG] 聊天错误:', err);
            store.updateMessage(conversationId, assistantMessageId, {
              isStreaming: false,
              error: true,
              content: `请求失败: ${err.message}`,
            });
            store.setIsGenerating(false);
          },
        }
      );
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        error.value = err.message;
      }
      store.setIsGenerating(false);
    }
  };

  const stopGeneration = (): void => {
    abortController.value?.abort();
    store.setIsGenerating(false);
  };

  const regenerateMessage = (): void => {
    // Find the last user message and resend
    const lastUserMessage = [...store.currentMessages]
      .reverse()
      .find((m: Message) => m.role === 'user');

    if (lastUserMessage) {
      // Delete AI responses after this user message
      const conversation = store.currentConversation;
      if (conversation) {
        const userIndex = conversation.messages.findIndex(
          (m) => m.id === lastUserMessage.id
        );
        if (userIndex > -1) {
          // Remove all messages after the user message
          conversation.messages = conversation.messages.slice(0, userIndex + 1);
        }
      }
      sendMessage(lastUserMessage.content);
    }
  };

  return {
    sendMessage,
    stopGeneration,
    regenerateMessage,
    error,
  };
}
