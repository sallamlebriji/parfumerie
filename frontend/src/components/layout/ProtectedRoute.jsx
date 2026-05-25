import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#0B0B0F] p-10 text-white">Chargement...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
