// hooks/useOAuthPopup.ts

// import { useEffect } from "react";
import { toast } from "sonner";

export const useOAuthPopup = () => {
  const openPopup = (mode: "login" | "register") => {
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      `http://localhost:3000/api/auth/google?state=${mode}`,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const listener = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:3000") return;

      if (event.data.type === "oauth-success") {
        console.log("Hello");
        // toast.success("Logged in successfully 🎉");
        toast("Success!", {
          description: "You have registered successfully.",
        });

        // Optional: you can store token or refetch auth state
        // localStorage.setItem("token", event.data.token);
        // refetchUser(); // if using SWR/React Query/AuthContext
      } else if (event.data.type === "oauth-error") {
        console.log("World");
        toast.error(event.data.message || "OAuth failed");
      }

      window.removeEventListener("message", listener);
    };

    window.addEventListener("message", listener);
  };

  return { openPopup };
};
