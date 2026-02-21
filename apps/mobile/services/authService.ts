import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types";
import { apiRequest } from "./api";
import { secureStorage } from "./secureStorage";

const extractSessionCookie = (headers: Headers): string | null => {
  const setCookie = headers.get("set-cookie");
  if (!setCookie) return null;

  const match = setCookie.match(/better-auth\.session_token=([^;]+)/);
  return match ? match[1] : null;
};

export const authService = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    await apiRequest<RegisterResponse>("/api/auth/sign-up/email", {
      method: "POST",
      body: payload,
    });

    return { message: "Please check your email to verify your account." };
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data, headers } = await apiRequest<LoginResponse>(
      "/api/auth/sign-in/email",
      {
        method: "POST",
        body: payload,
      },
    );

    const sessionToken = extractSessionCookie(headers);
    if (sessionToken) {
      await secureStorage.saveSessionToken(sessionToken);
    }

    return data;
  },

  forgotPassword: async (
    payload: ForgotPasswordPayload,
  ): Promise<ForgotPasswordResponse> => {
    const { data } = await apiRequest<Partial<ForgotPasswordResponse>>(
      "/api/auth/request-password-reset",
      {
        method: "POST",
        body: payload,
      },
    );

    return {
      status: data.status ?? true,
      message:
        data.message ??
        "If an account exists for this email, a reset code has been sent.",
    };
  },

  logout: async () => {
    await secureStorage.deleteSessionToken();
  },
};
