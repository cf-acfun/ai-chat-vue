import http from './http';
import type { ChatRequest, ChatResponse } from '@/types/chat';

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await http.post('/chat/completions', {
    ...request,
    model: request.model || import.meta.env.VITE_DEFAULT_MODEL || 'gpt-3.5-turbo',
    stream: false,
  });
  return response as unknown as ChatResponse;
}
