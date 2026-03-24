import type { ChatRequest, StreamChunk } from '@/types/chat';
import type { StreamCallbacks } from '@/types/api';

export async function fetchChatStream(
  request: ChatRequest,
  callbacks: StreamCallbacks & { signal?: AbortSignal }
): Promise<void> {
  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  
  try {
    const response = await fetch(`${baseUrl}/api/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        ...request,
        model: request.model || import.meta.env.VITE_DEFAULT_MODEL || 'gpt-3.5-turbo',
        stream: true,
      }),
      signal: callbacks.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    if (!reader) {
      throw new Error('No reader available');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            callbacks.onComplete();
            return;
          }
          
          try {
            const parsed: StreamChunk = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            fullContent += content;
            callbacks.onMessage(fullContent);
          } catch (e) {
            console.error('Parse error:', e, 'Data:', data);
          }
        }
      }
    }
    
    callbacks.onComplete();
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.log('Stream aborted');
      return;
    }
    callbacks.onError(error as Error);
  }
}
