import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
// Giả sử bạn đã có Dashboard và Header
import Dashboard from "./components/Dashboard"; 
import Header from "./components/Header";
import RequireAuth from "./api/RequireAuth";

const MainLayout = () => (
  <>
    <Header />
    <main style={{ padding: "20px", background: "#f5f5f5", minHeight: "calc(100vh - 60px)" }}>
      <Outlet />
    </main>
  </>
);

const App = () => {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* --- PRIVATE ROUTES (Cần đăng nhập) --- */}
      <Route element={<RequireAuth allowedRoles={['Manager', 'Receptionist']} />}>
        <Route element={<MainLayout />}>
           {/* Mặc định vào Dashboard */}
           <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
      
      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;