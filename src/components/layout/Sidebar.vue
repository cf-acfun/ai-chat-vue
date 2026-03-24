<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:static lg:transform-none',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-800">
      <h1 class="text-lg font-semibold flex items-center gap-2">
        <MessageSquare class="w-6 h-6 text-primary-400" />
        AI Chat
      </h1>
      <button
        class="lg:hidden p-1 hover:bg-gray-800 rounded-lg transition-colors"
        @click="closeSidebar"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- New Chat Button -->
    <div class="p-4">
      <button
        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors font-medium"
        @click="handleNewChat"
      >
        <Plus class="w-5 h-5" />
        新建对话
      </button>
    </div>

    <!-- Conversation List -->
    <div class="flex-1 overflow-y-auto px-3 pb-4">
      <div v-if="conversations.length === 0" class="text-center py-8 text-gray-500">
        <p>暂无对话</p>
        <p class="text-sm mt-1">点击上方按钮开始</p>
      </div>

      <div v-else class="space-y-1">
        <div
          v-for="conversation in sortedConversations"
          :key="conversation.id"
          :class="[
            'group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors',
            currentId === conversation.id
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-800',
          ]"
          @click="selectConversation(conversation.id)"
        >
          <MessageSquare class="w-4 h-4 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ conversation.title }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatRelativeTime(conversation.updatedAt) }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              class="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
              title="删除"
              @click.stop="handleDelete(conversation.id)"
            >
              <Trash2 class="w-4 h-4 text-gray-400 hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-800">
      <button
        class="flex items-center gap-3 w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-xl transition-colors"
        @click="goToSettings"
      >
        <Settings class="w-5 h-5" />
        <span>设置</span>
      </button>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    @click="closeSidebar"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  MessageSquare,
  Plus,
  Settings,
  Trash2,
  X,
} from 'lucide-vue-next';
import type { Conversation } from '@/types/chat';
import { formatRelativeTime } from '@/utils/helpers';

interface Props {
  conversations: Conversation[];
  currentId: string;
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'create'): void;
  (e: 'deleteConversation', id: string): void;
  (e: 'close'): void;
}>();

const router = useRouter();

const sortedConversations = computed(() => {
  return [...props.conversations].sort((a, b) => b.updatedAt - a.updatedAt);
});

const selectConversation = (id: string) => {
  emit('select', id);
  closeSidebar();
};

const handleNewChat = () => {
  emit('create');
  closeSidebar();
};

const closeSidebar = () => {
  emit('close');
};

const goToSettings = () => {
  router.push('/settings');
  closeSidebar();
};

const handleDelete = (id: string) => {
  emit('deleteConversation', id);
};
</script>
