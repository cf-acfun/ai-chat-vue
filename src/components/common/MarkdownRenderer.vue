<template>
  <div class="markdown-body" v-html="renderedContent" />
  <span
    v-if="isStreaming"
    class="inline-block w-2 h-4 bg-primary-500 ml-1 animate-pulse"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const props = defineProps<{
  content: string;
  isStreaming?: boolean;
}>();

// Create custom renderer for code highlighting
const renderer = new marked.Renderer();
renderer.code = (code: string, language?: string) => {
  const validLanguage = language && hljs.getLanguage(language) ? language : 'plaintext';
  const highlighted = hljs.highlight(code, { language: validLanguage }).value;
  return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
};

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true,
});

const renderedContent = computed(() => {
  if (!props.content) return '';
  try {
    return marked(props.content);
  } catch (e) {
    console.error('Markdown render error:', e);
    return props.content;
  }
});

onMounted(() => {
  // Apply syntax highlighting to any pre-existing code blocks
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block as HTMLElement);
  });
});
</script>
