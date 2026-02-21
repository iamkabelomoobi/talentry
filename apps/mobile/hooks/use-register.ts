import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { RegisterResponse, RegisterPayload } from "@/types";

type UseRegisterOptions = {
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (error: Error) => void;
};

export const useRegister = (options: UseRegisterOptions = {}) => {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
};
