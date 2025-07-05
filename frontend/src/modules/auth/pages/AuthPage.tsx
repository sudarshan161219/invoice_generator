import "./index.css";
import { type FC, type ReactElement } from "react";
import { RegisterLayout } from "@/layout/registerLayout/RegisterLayout";
import { LoginLayout } from "@/layout/loginLayout/LoginLayout";
import { useAuthLayout } from "@/hooks/useAuthLayout";

export const AuthPage: FC = (): ReactElement => {
  const { isLogin } = useAuthLayout();

  return <>{!isLogin ? <LoginLayout /> : <RegisterLayout />}</>;
};
