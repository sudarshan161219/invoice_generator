import "./index.css";
import { useNavigate } from "react-router-dom";
import { type FC, type ReactElement } from "react";
import { Login } from "@/modules/auth/components/login/Login";
import { IoLogoGoogle, IoLogoGithub } from "react-icons/io";
import { Button } from "@/components/button/Button";
import { GalleryVerticalEnd } from "lucide-react";
import { useAuthLayout } from "@/hooks/useAuthLayout";
import { useGoogleOAuth } from "@/hooks/useGoogleOAuth";
import { startGitHubOAuth } from "@/lib/oauth/GitHubOAuth";

export const LoginLayout: FC = (): ReactElement => {
  const { toggleLayout } = useAuthLayout();
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleOAuth("login", () => {
    navigate("/");
  });

  // const loginWithGitHub = () => {
  //   window.location.href = "http://localhost:3000/api/auth/github";
  // };

  return (
    <div className="flex flex-col gap-4 p-6 md:p-10 min-h-svh">
      <div className="flex items-center justify-start gap-5 md:justify-between">
        <a href="#" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Invii Online.
        </a>
      </div>

      <div className="flex flex-1  flex-col gap-8 items-center justify-center">
        <header className="login_bg_heading_container flex text-center flex-col gap-2">
          <h2 className="text-2xl font-bold text-primary">
            Login to your account
          </h2>
          <p className="text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </header>

        <div className="w-full max-w-xs">
          <Login />

          <div className="flex flex-col gap-5 mt-5">
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className=" text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={loginWithGoogle}
                variant="outline"
                type="button"
                className="w-full"
              >
                <IoLogoGoogle
                  size={17}
                  className="text-[var(--color-foreground)]"
                />
                <span className="sr-only">Login with Google</span>
              </Button>

              <Button
                // onClick={loginWithGitHub}
                onClick={() => startGitHubOAuth("login")}
                variant="outline"
                type="button"
                className="w-full"
              >
                <IoLogoGithub
                  size={17}
                  className="text-[var(--color-foreground)]"
                />
                <span className="sr-only">Login with Github</span>
              </Button>
            </div>

            <div className="mobile-btn-container">
              <span>Don't have an account?</span>
              <button
                onClick={toggleLayout}
                className="cursor-pointer font-normal underline text-primary ml-1 "
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
