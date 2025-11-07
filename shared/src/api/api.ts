
const LOCAL_IP = "ip-address-or-localhost"; 
const PORT = 5000;

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? `http://${LOCAL_IP}:${PORT}`
    : "http://68.183.171.109";

// Small helper to make POST requests
async function post(endpoint: string, body: any) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Small helper to make GET requests
async function get(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  return res.json();
}

/* ──────────────── API CALLS ──────────────── */

// 🔹 Simple test endpoint
export async function ping() {
  return get("/api/ping");
}

// 🔹 Signup (create account)
export async function signup(
  firstName: string,
  lastName: string,
  login: string,
  password: string,
  email: string
) {
  return post("/api/signup", { firstName, lastName, login, password, email });
}

// 🔹 Verify user (after email verification)
export async function verify(login: string, verificationCode: string) {
  return post("/api/verify", { login, verificationCode });
}

// 🔹 Login
export async function loginUser(login: string, password: string) {
  return post("/api/login", { login, password });
}

// 🔹 Add card
export async function addCard(userId: number, card: string) {
  return post("/api/addcard", { userId, card });
}

// 🔹 Search cards
export async function searchCards(userId: number, search: string) {
  return post("/api/searchcards", { userId, search });
}

// 🔹 Request password reset
export async function requestPasswordReset(email: string) {
  return post("/api/request-password-reset", { email });
}

// 🔹 Reset password
export async function resetPassword(email: string, resetCode: string, newPassword: string) {
  return post("/api/reset-password", { email, resetCode, newPassword });
}

// 🔹 Generate AI flashcards
export async function generateFlashcards(topic: string) {
  return post("/api/generate-flashcards", { topic });
}
