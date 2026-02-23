import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { SignUpPayload } from "@/types/auth";

export const useSignUp = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: SignUpPayload) => authApi.signUp(payload),
    onSuccess: (_, payload) => {
      sessionStorage.setItem("pending_verification_email", payload.email);
      router.push("/auth/confirm-email");
    },
  });
};
