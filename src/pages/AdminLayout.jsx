import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {

  // const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AdminLayout;