export const APP_NAME = "My App";

export const API_BASE_URL = "http://172.28.160.1:3000";

export function getApiUrl(envApiUrl?: string): string {
  if (envApiUrl) {
    return envApiUrl;
  }
  return API_BASE_URL;
}