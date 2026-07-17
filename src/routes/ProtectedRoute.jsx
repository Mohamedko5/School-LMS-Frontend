import { Navigate, Outlet } from "react-router-dom";
import { roleHome } from "../utils/storage";

export default function ProtectedRoute({ user }) {
  if (!user?.name || !roleHome[user?.role]) return <Navigate to="/login" replace />;
  return <Outlet context={{ user, home: roleHome[user.role] }} />;
}
