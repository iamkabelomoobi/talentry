import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { ForgotPasswordPayload, ForgotPasswordResponse } from "@/types";
import { router } from "expo-router";

type UseForgotPasswordOptions = {
  onSuccess?: (data: ForgotPasswordResponse) => void;
  onError?: (error: Error) => void;
};

export const useForgotPassword = (options: UseForgotPasswordOptions = {}) => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: (payload) => authService.forgotPassword(payload),
    onSuccess: (data, payload) => {
      router.push({
        pathname: "/CheckEmailScreen",
        params: { email: payload.email },
      });
    },
    onError: options.onError,
  });
};
