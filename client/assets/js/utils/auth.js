// utils/auth.js
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html?redirect=' + window.location.pathname;
    return false;
  }
  return true;
}

// Use in pages
import { requireAuth } from './auth.js';
if (requireAuth()) {
  // Load protected content
}