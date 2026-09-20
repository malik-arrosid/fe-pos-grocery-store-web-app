import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore.js";
import { toApiUrl } from "../lib/http/apiOrigin.js";

const AUTH_URL = toApiUrl("/api/auth");

async function login(username, password) {
  const res = await axios.post(
    `${AUTH_URL}/login`,
    { username, password },
    { withCredentials: true }
  );
  const { user } = res.data;
  useAuthStore.getState().setUser(user);
  return user;
}

async function logout() {
  const { role } = useAuthStore.getState();
  try {
    if (role) {
      await axios.post(
        toApiUrl(`/api/${role}/auth/logout`),
        {},
        { withCredentials: true }
      );
    }
  } finally {
    useAuthStore.getState().clearUser();
  }
}

function getCurrentUser() {
  return useAuthStore.getState().user;
}

function isAuthenticated() {
  return !!useAuthStore.getState().user;
}

export { login, logout, getCurrentUser, isAuthenticated };