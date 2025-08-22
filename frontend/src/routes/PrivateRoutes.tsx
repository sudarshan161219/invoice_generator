import { Navigate } from "react-router-dom";
import { Sidebar } from "@/layout/sidebarLayout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/loading";

export const PrivateRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;

  return user ? <Sidebar /> : <Navigate to="/auth" />;
};
