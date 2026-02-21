export type LoginPayload = {
  email: string;
  password: string;
};

type User = {
  id: string;
  image: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResponse = {
  status: boolean;
  message: string;
};
