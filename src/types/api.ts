export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface StreamCallbacks {
  onMessage: (content: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}
