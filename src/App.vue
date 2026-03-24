<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChatStore } from '@/stores/chat';

const chatStore = useChatStore();

onMounted(() => {
  // Create a new conversation if none exists
  if (chatStore.conversations.length === 0) {
    chatStore.createConversation();
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
