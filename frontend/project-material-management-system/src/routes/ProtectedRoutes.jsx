import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
};

export default ProtectedRoutes;
