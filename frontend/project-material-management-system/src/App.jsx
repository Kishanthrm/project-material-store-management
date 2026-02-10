import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./staff/components/Header";
import StaffDashboard from "./staff/StaffDashboard";
import AdminDashboard from "./storeadmin/AdminDashBoard";
import UserDashBoard from "./user/pages/UserDashBoard";
import HomePage from "./user/pages/HomePage";
import MaterialList from "./user/pages/MaterialList";
import Login from "./user/pages/Login";
import Registration from "./user/pages/Registration";
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoutes allowedRoles={["LAB_INCHARGE"]}>
                  <AdminDashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/userhomepage"
            element={
              <ProtectedRoutes allowedRoles={["USER"]}>
                <HomePage/>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/materiallist"
            element={
              <ProtectedRoutes allowedRoles={["USER"]}>
                <MaterialList/>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoutes allowedRoles={["USER"]}>
                  <UserDashBoard/>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/storedashboard"
            element={
              <ProtectedRoutes allowedRoles={["STORE_ADMIN"]}>
                <StaffDashboard/>    
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
