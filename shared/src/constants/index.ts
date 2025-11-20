export const APP_NAME = "My App";

export const API_BASE_URL = "http://evalopez.xyz/api";

export function getApiUrl(envApiUrl?: string): string {
  if (envApiUrl) {
    return envApiUrl;
  }
  return API_BASE_URL;
}
