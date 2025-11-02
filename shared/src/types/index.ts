export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
}