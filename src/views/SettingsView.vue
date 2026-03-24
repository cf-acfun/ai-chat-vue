<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
        <button
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          @click="goBack"
        >
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </button>
        <h1 class="text-xl font-semibold text-gray-900">设置</h1>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- API Settings -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Key class="w-5 h-5 text-primary-500" />
              API 设置
            </h2>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                API Base URL
              </label>
              <input
                v-model="settings.apiBaseUrl"
                type="text"
                placeholder="https://api.openai.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p class="mt-1 text-sm text-gray-500">
                留空使用默认地址
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div class="relative">
                <input
                  v-model="settings.apiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  placeholder="sk-..."
                  class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  @click="showApiKey = !showApiKey"
                >
                  <Eye v-if="!showApiKey" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                您的 API Key 仅存储在本地浏览器中
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                默认模型
              </label>
              <select
                v-model="settings.defaultModel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Generation Settings -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal class="w-5 h-5 text-primary-500" />
              生成设置
            </h2>
          </div>
          <div class="p-6 space-y-6">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700">
                  Temperature
                </label>
                <span class="text-sm text-gray-500">{{ settings.temperature }}</span>
              </div>
              <input
                v-model.number="settings.temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="w-full"
              />
              <p class="mt-1 text-sm text-gray-500">
                较高的值会产生更随机的输出，较低的值会产生更确定性的输出
              </p>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700">
                  最大 Token 数
                </label>
                <span class="text-sm text-gray-500">{{ settings.maxTokens }}</span>
              </div>
              <input
                v-model.number="settings.maxTokens"
                type="range"
                min="100"
                max="8000"
                step="100"
                class="w-full"
              />
            </div>
          </div>
        </section>

        <!-- Appearance Settings -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Palette class="w-5 h-5 text-primary-500" />
              外观设置
            </h2>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                主题
              </label>
              <div class="flex gap-3">
                <button
                  v-for="theme in themes"
                  :key="theme.value"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                    settings.theme === theme.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50',
                  ]"
                  @click="selectTheme(theme.value)"
                >
                  <component :is="theme.icon" class="w-4 h-4" />
                  {{ theme.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                字体大小
              </label>
              <div class="flex gap-3">
                <button
                  v-for="size in fontSizes"
                  :key="size.value"
                  :class="[
                    'px-4 py-2 rounded-lg border transition-colors',
                    settings.fontSize === size.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50',
                  ]"
                  @click="selectFontSize(size.value)"
                >
                  {{ size.label }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Data Settings -->
        <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Database class="w-5 h-5 text-primary-500" />
              数据管理
            </h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">清除所有对话</h3>
                <p class="text-sm text-gray-500">这将删除所有对话历史，此操作无法撤销</p>
              </div>
              <button
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                @click="handleClearAll"
              >
                清除全部
              </button>
            </div>
          </div>
        </section>

        <!-- Save Button -->
        <div class="flex justify-end gap-4">
          <button
            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            @click="resetSettings"
          >
            重置
          </button>
          <button
            class="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            @click="saveSettings"
          >
            保存设置
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeft,
  Key,
  SlidersHorizontal,
  Palette,
  Database,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
} from 'lucide-vue-next';
import { useSettingsStore, type Settings } from '@/stores/settings';
import { useChatStore } from '@/stores/chat';

const router = useRouter();
const settingsStore = useSettingsStore();
const chatStore = useChatStore();

const showApiKey = ref(false);

const settings = reactive<Settings>({ ...settingsStore.settings });

const themes: { value: Settings['theme']; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'auto', label: '自动', icon: Monitor },
];

const fontSizes: { value: Settings['fontSize']; label: string }[] = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
];

const selectTheme = (value: Settings['theme']) => {
  settings.theme = value;
};

const selectFontSize = (value: Settings['fontSize']) => {
  settings.fontSize = value;
};

const goBack = () => {
  router.back();
};

const saveSettings = () => {
  settingsStore.updateSettings(settings);
  alert('设置已保存');
};

const resetSettings = () => {
  if (confirm('确定要重置所有设置吗？')) {
    settingsStore.resetSettings();
    Object.assign(settings, settingsStore.settings);
  }
};

const handleClearAll = () => {
  if (confirm('确定要清除所有对话吗？此操作无法撤销。')) {
    chatStore.conversations = [];
    chatStore.currentConversationId = '';
  }
};
</script>
