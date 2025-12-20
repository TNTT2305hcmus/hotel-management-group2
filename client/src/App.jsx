import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./temp/ReceptionistDashboard";
import DashboardManager from "./temp/ManagerDashboard";
import PrivateRoute from "./routes/RoutePrivate";
import ResetPassword from "./components/ResetPassword"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Route bảo vệ */}
      <Route 
        path="/receptionist-dashboard" 
        element={
          <PrivateRoute allowedRoles={['receptionist']}>
            <Dashboard />
          </PrivateRoute>
        } 
      />
           <Route 
        path="/manager-dashboard" 
        element={
          <PrivateRoute allowedRoles={['manager']}>
            <DashboardManager />
          </PrivateRoute>
        } 
      />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;