import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import StaffDashboard from "./staff/StaffDashboard";
import AdminDashboard from "./storeadmin/AdminDashBoard";
import UserDashBoard from "./user/pages/UserDashBoard";
import HomePage from "./user/pages/HomePage";
import MaterialList from "./user/pages/MaterialList";
import Login from "./login/Login";
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/userhomepage"
            element={
              <ProtectedRoutes allowedRoles={["student"]}>
                <HomePage/>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/materiallist"
            element={
              <ProtectedRoutes allowedRoles={["student"]}>
                <MaterialList/>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoutes allowedRoles={["student"]}>
                  <UserDashBoard/>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/staffdashboard"
            element={
              <ProtectedRoutes allowedRoles={["lab_incharge"]}>
                <StaffDashboard/>    
              </ProtectedRoutes>
            }
          />
          <Route
            path="/storedashboard"
            element={
              <ProtectedRoutes allowedRoles={["store_admin"]}>
                <AdminDashboard/>    
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
