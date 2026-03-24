import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  apiKey: string;
  apiBaseUrl: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
}

const defaultSettings: Settings = {
  theme: 'light',
  fontSize: 'medium',
  language: 'zh-CN',
  apiKey: '',
  apiBaseUrl: '',
  defaultModel: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
};

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref<Settings>({ ...defaultSettings });

  // Actions
  const updateSettings = (newSettings: Partial<Settings>): void => {
    settings.value = { ...settings.value, ...newSettings };
  };

  const resetSettings = (): void => {
    settings.value = { ...defaultSettings };
  };

  const setApiKey = (key: string): void => {
    settings.value.apiKey = key;
  };

  const setApiBaseUrl = (url: string): void => {
    settings.value.apiBaseUrl = url;
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    setApiKey,
    setApiBaseUrl,
  };
});
