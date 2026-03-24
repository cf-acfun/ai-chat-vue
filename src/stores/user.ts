import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const isLoggedIn = ref(false);

  // Actions
  const setUser = (userData: User): void => {
    user.value = userData;
    isLoggedIn.value = true;
  };

  const clearUser = (): void => {
    user.value = null;
    isLoggedIn.value = false;
  };

  const updateUser = (updates: Partial<User>): void => {
    if (user.value) {
      user.value = { ...user.value, ...updates };
    }
  };

  return {
    user,
    isLoggedIn,
    setUser,
    clearUser,
    updateUser,
  };
});
