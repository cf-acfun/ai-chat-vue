import { ref, nextTick } from 'vue';

export function useScroll() {
  const scrollContainer = ref<HTMLElement | null>(null);
  const isAtBottom = ref(true);

  const scrollToBottom = async (behavior: ScrollBehavior = 'smooth'): Promise<void> => {
    await nextTick();
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: scrollContainer.value.scrollHeight,
        behavior,
      });
    }
  };

  const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: 0,
        behavior,
      });
    }
  };

  const handleScroll = (): void => {
    if (scrollContainer.value) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
      isAtBottom.value = scrollHeight - scrollTop - clientHeight < 50;
    }
  };

  const scrollToElement = (element: HTMLElement, behavior: ScrollBehavior = 'smooth'): void => {
    element.scrollIntoView({ behavior, block: 'nearest' });
  };

  return {
    scrollContainer,
    isAtBottom,
    scrollToBottom,
    scrollToTop,
    handleScroll,
    scrollToElement,
  };
}
