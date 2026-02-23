import { UserRole } from "../user/user";

export interface SignInPayload {
  email: string;
  password: string;
}
export interface SignUpPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole.COMPANY | UserRole.SEEKER;
}

export type ForgotPasswordPayload = {
  email: string;
  redirectTo: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export interface AuthResponse {
  token?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    emailVerified: boolean;
    image: null;
    createdAt: string;
    updatedAt: string;
    role: UserRole;
  };
}
