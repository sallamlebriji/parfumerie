import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canAccessModule } from "../../constants/permissions";

export const RequireAccess = ({ module, children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#0B0B0F] p-10 text-white">Chargement...</div>;
  return canAccessModule(user, module) ? children : <Navigate to="/access-denied" replace />;
};
