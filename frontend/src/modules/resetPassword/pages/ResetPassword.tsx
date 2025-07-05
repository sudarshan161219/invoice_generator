import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordForm } from "../types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { resetPassword_post } from "../hooks/resetPassword.api";
import { toast } from "sonner";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? "",
    },
  });

  useEffect(() => {
    if (!token) {
      console.log("Invalid or missing reset token.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);
    try {
      const forgotPasswordData: ResetPasswordForm = data;
      await resetPassword_post(forgotPasswordData);
      console.log(forgotPasswordData);
      // login();
      toast.success("You have been logged in successfully.");
      navigate("/auth");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          type="password"
          label="Password"
          placeholder="******"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          isLoading={loading}
          variant="default"
          size="md"
          className="text-sm"
        >
          Reset password
        </Button>
      </form>
    </div>
  );
};
