import { API_BASE_URL } from '../constants';
import { LoginRequest, LoginResponse } from '../types';

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  return data;
}