import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { ForgotPasswordPayload } from "@/types/auth";

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
    onSuccess: (_, payload) => {
      sessionStorage.setItem("pending_forgot_password_email", payload.email);
      router.push("/auth/forgot-password/sent");
    },
  });
};
