import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { googleOAuth } from "@/modules/auth/api/auth.api";

type Mode = "login" | "register";

export function useGoogleOAuth(mode: Mode, onSuccessRedirect?: () => void) {
  const login = useGoogleLogin({
    flow: "auth-code", // 👈 correct flow to get authorization code
    onSuccess: async ({ code }) => {
      try {
        const { success } = await googleOAuth(code, mode);

        if (success) {
          toast.success("Logged in successfully");
          onSuccessRedirect?.(); // 🔥 call redirect
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || "OAuth login failed";
        toast.error(msg);
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return login;
}
