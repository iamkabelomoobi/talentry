import apiClient from "./client";
import {
  AuthResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
} from "@/types/auth";

export const authApi = {
  signIn: (payload: SignInPayload) =>
    apiClient
      .post<AuthResponse>("/api/auth/sign-in/email", payload)
      .then((r) => r.data),
  signUp: (payload: SignUpPayload) =>
    apiClient
      .post<AuthResponse>("/api/auth/sign-up/email", payload)
      .then((r) => r.data),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient
      .post("/api/auth/request-password-reset", payload)
      .then((r) => r.data),
  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient
      .post("/api/auth/reset-password", payload)
      .then((r) => r.data),
  signOut: () => apiClient.post("/api/auth/sign-out").then((r) => r.data),

};
