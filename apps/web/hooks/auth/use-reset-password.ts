import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { ResetPasswordPayload } from "@/types/auth";

export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
  });
