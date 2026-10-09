import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";

import type {
  AuthData,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

export const authService = {
  login(payload: LoginPayload) {
    return apiFetch<AuthData>(
      endpoints.auth.login,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  googleLogin(idToken: string) {
    return apiFetch<AuthData>(
      endpoints.auth.google,
      {
        method: "POST",
        body: JSON.stringify({ idToken }),
      }
    );
  },

  register(payload: RegisterPayload) {
    return apiFetch<User>(
      endpoints.auth.register,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  me() {
    return apiFetch<User>(
      endpoints.auth.me
    );
  },

  refresh() {
    return apiFetch<AuthData>(
      endpoints.auth.refresh,
      {
        method: "POST",
      }
    );
  },

  logout() {
    return apiFetch<null>(
      endpoints.auth.logout,
      {
        method: "POST",
      }
    );
  },
};