/**
 * Base URL for the API.
 * Uses the environment variable VITE_API_BASE_URL if set,
 * otherwise falls back to http://localhost:3001 for local development.
 */
const envUrl = import.meta.env.VITE_API_BASE_URL;

// Ensure there is no trailing slash to prevent double slashes like //api/...
export const API_BASE_URL = envUrl ? envUrl.replace(/\/$/, '') : "http://localhost:3001";
