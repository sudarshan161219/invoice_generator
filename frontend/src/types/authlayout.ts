export type IsLogin = boolean;
export interface AuthLayoutContextType {
  isLogin: IsLogin;
  toggleLayout: () => void;
  setIsLogin: (collapse: IsLogin) => void;
}
