import { Navigate } from "react-router-dom";
// import { useEffect } from "react";
import { Sidebar } from "@/layout/sidebarLayout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/loading";

export const PrivateRoutes = () => {
  const { user, loading } = useAuth();

  // // Debugging logs
  // useEffect(() => {
  //   // console.log("PrivateRoute mounted");
  //   // console.log("user:", user);
  //   console.log("userId:", userId);
  //   // console.log("loading:", loading);
  // }, [user, userId, loading]);

  if (loading) return <LoadingSpinner />;

  return user ? <Sidebar /> : <Navigate to="/auth" />;
};
