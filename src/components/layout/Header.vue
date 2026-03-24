<template>
  <header
    class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-20"
  >
    <div class="flex items-center gap-3">
      <!-- Mobile menu button -->
      <button
        class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        @click="toggleSidebar"
      >
        <Menu class="w-5 h-5 text-gray-600" />
      </button>

      <!-- Title -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-md">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-xs text-gray-500">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button
        v-if="showClear"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        title="清空对话"
        @click="handleClear"
      >
        <Trash2 class="w-5 h-5" />
      </button>

      <button
        v-if="showSettings"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        title="设置"
        @click="goToSettings"
      >
        <Settings class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Menu, Trash2, Settings } from 'lucide-vue-next';

interface Props {
  title: string;
  subtitle?: string;
  showClear?: boolean;
  showSettings?: boolean;
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  showClear: true,
  showSettings: false,
});

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void;
  (e: 'clear'): void;
}>();

const router = useRouter();

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const handleClear = () => {
  emit('clear');
};

const goToSettings = () => {
  router.push('/settings');
};
</script>
