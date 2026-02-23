import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { SignInPayload } from "@/types/auth";

export function useSignIn() {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: SignInPayload) => authApi.signIn(payload),
    onSuccess: ({ token }) => {
      if (typeof token === "string" && token.trim().length > 0) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
      router.push("/");
    },
  });
}


