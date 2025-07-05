import { type FC, type ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordForm } from "../types";
import { forgotPassword_post } from "../hooks/forgotPassword.api";
import { toast } from "sonner";

export const ForgotPasswordPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      const forgotPasswordData: ForgotPasswordForm = data;
      const res = await forgotPassword_post(forgotPasswordData);
      // login();
      toast.success(res.message);
      // navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md bg-[var(--card)] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[var( --foreground)]">
          Forgot Password
        </h2>
        <p className="text-sm text-center text-[var( --label)] mt-2 mb-6">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Button type="submit" variant="default" size="md" className="text-sm">
            Send Reset Link
          </Button>
        </form>

        <div className="text-center mt-4 flex justify-center">
          <Button
            onClick={() => navigate("/auth")}
            type="button"
            variant="ghost"
            size="md"
            isLoading={loading}
            className="text-sm flex items-center gap-3"
          >
            <ArrowLeft size={15} /> Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};
