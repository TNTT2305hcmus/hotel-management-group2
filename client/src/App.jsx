import { Routes, Route, Outlet, Navigate } from "react-router-dom";

// --- PAGES ---
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import Checkout from "./pages/Checkout";
import RoomDetail from "./pages/roomDetail";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import UserProfile from "./pages/userProfile";
import Header from "./pages/Header";

// --- UTILS ---
import RequireAuth from "./api/RequireAuth";

// Layout chính: Header + Nội dung bên dưới
const MainLayout = () => (
  <>
    <Header />
    <main style={{ padding: "20px 40px", background: "#f1f5f9", minHeight: "calc(100vh - 60px)" }}>
      <Outlet />
    </main>
  </>
);

const App = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 2. PROTECTED ROUTES */}
      
      {/* A. SHARED ROUTES */}
      <Route element={<RequireAuth allowedRoles={['Manager', 'Receptionist']} />}>
        <Route element={<MainLayout />}>
          {/* Mặc định vào dashboard sau khi đăng nhập */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/settings/profile" element={<UserProfile />} />
          <Route path="/report" element={<Report />} />
        </Route>
      </Route>

      {/* B. MANAGER ONLY ROUTES */}
      <Route element={<RequireAuth allowedRoles={['Manager']} />}>
        <Route element={<MainLayout />}>
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 3. CATCH ALL (404) */}
      {/* Nếu nhập linh tinh thì đá về Login hoặc Dashboard */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;