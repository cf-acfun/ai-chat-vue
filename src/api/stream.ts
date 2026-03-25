import type { ChatRequest, StreamChunk } from '@/types/chat';
import type { StreamCallbacks } from '@/types/api';

export async function fetchChatStream(
  request: ChatRequest,
  callbacks: StreamCallbacks & { signal?: AbortSignal }
): Promise<void> {
  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  
  // 调试日志：打印环境变量
  console.log('[DEBUG] VITE_API_BASE_URL:', baseUrl);
  console.log('[DEBUG] API Key 是否存在:', !!apiKey);
  
  // 构建请求 URL
  const requestUrl = baseUrl 
    ? `${baseUrl}/api/chat/completions`  // 使用完整 URL（直接访问后端）
    : '/api/chat/completions';           // 使用相对路径（走 Vite 代理）
  
  console.log('[DEBUG] 请求 URL:', requestUrl);
  console.log('[DEBUG] 请求体:', JSON.stringify(request, null, 2));
  
  try {
    const response = await fetch(requestUrl, {
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

    console.log('[DEBUG] 响应状态:', response.status, response.statusText);
    console.log('[DEBUG] 响应 Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DEBUG] HTTP 错误响应:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    if (!reader) {
      throw new Error('No reader available');
    }

    console.log('[DEBUG] 开始读取流式响应...');

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('[DEBUG] 流式响应结束');
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      console.log('[DEBUG] 收到数据块:', chunk);
      
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            console.log('[DEBUG] 收到 [DONE] 标记');
            callbacks.onComplete();
            return;
          }
          
          try {
            const parsed: StreamChunk = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            fullContent += content;
            callbacks.onMessage(fullContent);
          } catch (e) {
            console.error('[DEBUG] JSON 解析错误:', e, '原始数据:', data);
          }
        }
      }
    }
    
    callbacks.onComplete();
  } catch (error) {
    console.error('[DEBUG] 请求异常:', error);
    if ((error as Error).name === 'AbortError') {
      console.log('[DEBUG] 请求被中止');
      return;
    }
    callbacks.onError(error as Error);
  }
}
