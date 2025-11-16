import { API_BASE_URL } from '../constants';

/* ──────────────── TYPES ──────────────── */

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  error: string;
}

export interface SignupResponse {
  error: string;
}

export interface VerifyResponse {
  success: boolean;
  error: string;
}

export interface PasswordResetResponse {
  error: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  error: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardSet {
  _id: string;
  userId: number;
  topic: string;
  flashcards: Flashcard[];
  createdAt: string;
  cardCount: number;
  highestScore?: number;
  lastTestDate?: string;
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TestScoreResponse {
  success: boolean;
  highestScore: number;
  error?: string;
}

export interface SearchCardsResponse {
  results: string[];
  error: string;
}

export interface AddCardResponse {
  error: string;
}

export interface DeleteSetResponse {
  success: boolean;
  message: string;
  error?: string;
}

/* ──────────────── HELPER FUNCTIONS ──────────────── */

async function post(endpoint: string, body: any) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(endpoint: string) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`);
  return res.json();
}

async function deleteRequest(endpoint: string, body: any) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

/* ──────────────── API CALLS ──────────────── */

// 🔹 Simple test endpoint
export async function ping(): Promise<{ message: string }> {
  return get('/api/ping');
}

// 🔹 Signup (create account)
export async function signup(
  firstName: string,
  lastName: string,
  login: string,
  password: string,
  email: string
): Promise<SignupResponse> {
  return post('/api/signup', { firstName, lastName, login, password, email });
}

// 🔹 Verify user (after email verification)
export async function verify(
  login: string,
  verificationCode: string
): Promise<VerifyResponse> {
  return post('/api/verify', { login, verificationCode });
}

// 🔹 Login
export async function loginUser(
  login: string,
  password: string
): Promise<LoginResponse> {
  return post('/api/login', { login, password });
}

// 🔹 Add card
export async function addCard(
  userId: number,
  card: string
): Promise<AddCardResponse> {
  return post('/api/addcard', { userId, card });
}

// 🔹 Search cards
export async function searchCards(
  userId: number,
  search: string
): Promise<SearchCardsResponse> {
  return post('/api/searchcards', { userId, search });
}

// 🔹 Request password reset
export async function requestPasswordReset(
  email: string
): Promise<PasswordResetResponse> {
  return post('/api/request-password-reset', { email });
}

// 🔹 Reset password
export async function resetPassword(
  email: string,
  resetCode: string,
  newPassword: string
): Promise<ResetPasswordResponse> {
  return post('/api/reset-password', { email, resetCode, newPassword });
}

// 🔹 Generate AI flashcards
export async function generateFlashcards(
  topic: string,
  userId: number
): Promise<Flashcard[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate flashcards');
    }

    const data = await response.json();
    console.log('API Response:', data); // DEBUG
    return data;
  } catch (error) {
    console.error('generateFlashcards error:', error);
    throw error;
  }
}

// 🔹 Get all flashcard sets for a user
export async function getFlashcardSets(
  userId: number
): Promise<FlashcardSet[]> {
  return post('/api/get-flashcard-sets', { userId });
}

// 🔹 Generate a test based on a flashcard set
export async function generateTest(
  setId: string,
  userId: number
): Promise<TestQuestion[]> {
  return post('/api/generate-test', { setId, userId });
}

// 🔹 Delete a flashcard set
export async function deleteFlashcardSet(
  setId: string,
  userId: number
): Promise<DeleteSetResponse> {
  return post('/api/delete-flashcard-set', { setId, userId });
}

// 🔹 Store test score
export async function storeTestScore(
  setId: string,
  userId: number,
  score: number,
  totalQuestions: number,
  correctAnswers: number
): Promise<TestScoreResponse> {
  return post('/api/store-test-score', {
    setId,
    userId,
    score,
    totalQuestions,
    correctAnswers,
  });
}