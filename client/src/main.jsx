import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider, useAuth } from "./api/AuthContext.jsx";
import { attachAuthInterceptors } from "./api/axiosClient.js";

function InterceptorBinder({ children }) {
  const auth = useAuth();

  useEffect(() => {
    // attach interceptors và nhận về hàm cleanup để eject
    const detach = attachAuthInterceptors({
      getAccessToken: () => auth.accessToken,
      onAuthFail: () => auth.logout(),
    });

    return () => {
      // tránh bị nhân đôi interceptor khi StrictMode mount/unmount dev
      detach?.();
    };
  }, [auth]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <InterceptorBinder>
        <App />
      </InterceptorBinder>
    </AuthProvider>
  </StrictMode>
);
