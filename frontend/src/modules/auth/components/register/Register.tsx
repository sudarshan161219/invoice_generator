import { useState, type FC, type ReactElement } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterForm,
} from "@/modules/auth/schemas/services";
import type { IRegisterDTO } from "@/types/register";
import { registerUser } from "../../api/auth.api";
import { toast } from "sonner";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";

export const Register: FC = (): ReactElement => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const registerData: IRegisterDTO = {
        name: data.username,
        email: data.email,
        password: data.password,
      };
      await registerUser(registerData);
      toast("Success!", {
        description: "You have registered successfully.",
      });
    } catch (error: unknown) {
      let message = "Something went wrong during registration.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      console.error("Registration failed", error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <Input
          type="text"
          label="Username"
          placeholder="Username"
          error={errors.username?.message}
          {...register("username")}
        />
        {/* {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )} */}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="text"
          label="Email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        {/* {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )} */}
      </div>

      <div className="flex flex-col gap-1">
        <div className="input-icon-container relative">
          <Input
            type="password"
            label="Password"
            {...register("password")}
            placeholder="••••••••"
            error={errors.password?.message}
          />
        </div>
        {/* {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )} */}
      </div>
      <Button
        isLoading={loading}
        type="submit"
        loadingText="Please wait..."
        variant="default"
        size="md"
        className="text-sm"
      >
        Sign up
      </Button>
    </form>
  );
};
