import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { LoginResponse, LoginPayload } from "@/types";

type UseLoginOptions = {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
};

export const useLogin = (options: UseLoginOptions = {}) => {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
};
