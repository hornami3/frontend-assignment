export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  userId: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoListResponse {
  todos: Todo[];
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title: string;
  description?: string;
}
