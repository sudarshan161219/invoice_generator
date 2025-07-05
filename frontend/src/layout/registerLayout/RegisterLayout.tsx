import "./index.css";
import { type FC, type ReactElement } from "react";
import { Register } from "@/modules/auth/components/register/Register";
import { IoLogoGoogle, IoLogoGithub } from "react-icons/io";
import { Button } from "@/components/button/Button";
import { GalleryVerticalEnd } from "lucide-react";
import boy from "../../assets/boy.svg";
import girl from "../../assets/girl.svg";
import { useAuthLayout } from "@/hooks/useAuthLayout";
// import { useOAuthPopup } from "@/hooks/useOAuthPopup";
import { useGoogleOAuth } from "@/hooks/useGoogleOAuth";
// import { useHandleGitHubOAuth } from "@/hooks/useGithubOAuth";
import { startGitHubOAuth } from "@/lib/oauth/GitHubOAuth";

export const RegisterLayout: FC = (): ReactElement => {
  const { toggleLayout } = useAuthLayout();
  const registerWithGoogle = useGoogleOAuth("register");

  // const loginWithGitHub = () => {
  //   useHandleGitHubOAuth("login");
  //   const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  //   const redirectUri = "http://localhost:5173/oauth/github";

  //   const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

  //   window.location.href = githubLoginUrl; // 👈 manual redirect
  // };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className=" relative hidden lg:block register_bg border-r">
        <div className="register_bg_heading_container">
          <h2 className="text-2xl font-bold text-primary">Welcome to Invii</h2>
          <p className="text-muted-foreground">
            Send professional invoices, track payments, and manage clients — all
            in one place, with zero hassle.
          </p>
        </div>
        <div className="register_bg_img_container">
          <img src={boy} alt="Image" width={150} />
          <img src={girl} alt="Image" width={210} />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-start gap-2 md:justify-between">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Invii Online.
          </a>

          <div className="btn-container">
            <span>Already have an account?</span>
            <button
              onClick={toggleLayout}
              className="cursor-pointer font-normal underline text-primary ml-1 "
            >
              Sign in
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 items-center justify-center">
          <header className="login_bg_heading_container flex text-center flex-col gap-2 lg:hidden">
            <h2 className="text-2xl font-bold text-primary">
              Sign up to get started
            </h2>
            <p className="text-muted-foreground">
              Easily manage clients and invoices.
            </p>
          </header>
          <div className="w-full max-w-xs">
            <Register />

            <div className="flex flex-col gap-5 mt-5">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className=" text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  // onClick={loginWithGoogle}
                  // onClick={() => openPopup("register")}
                  onClick={() => registerWithGoogle()}
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
                  onClick={() => startGitHubOAuth("register")}
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

              {/* <div className="mobile-btn-container">
                <span>Already have an account?</span>
                <button
                  onClick={toggleLayout}
                  className="cursor-pointer font-normal underline text-primary ml-1 "
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
