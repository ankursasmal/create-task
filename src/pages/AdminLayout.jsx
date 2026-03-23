import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminLayout;