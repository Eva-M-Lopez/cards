export const APP_NAME = "My App";

export const API_BASE_URL = "http://10.174.13.167:5000";

export function getApiUrl(envApiUrl?: string): string {
  if (envApiUrl) {
    return envApiUrl;
  }
  return API_BASE_URL;
}