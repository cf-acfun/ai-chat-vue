export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model?: string;
}

export interface ChatRequest {
  messages: Omit<Message, 'id' | 'timestamp' | 'isStreaming' | 'error'>[];
  model?: string;
  stream?: boolean;
  temperature?: number;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }[];
}
