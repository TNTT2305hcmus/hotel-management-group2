import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginAPI, registerAPI } from "../services/authService"; 

const AuthContext = createContext(null);
const LS_KEY = "hm_token"; 

const initialState = {
  accessToken: null,
  user: null, 
  isAuthenticated: false,
  loading: true,
};

function parseAccessToken(token) {
  try {
    const p = jwtDecode(token);
    return {
      username: p.username,
      accountTypeID: p.accountTypeID,
      accountTypeName: p.accountTypeName,
      exp: p.exp, 
    };
  } catch (e) {
    return null;
  }
}

function isExpired(expSeconds) {
  if (!expSeconds) return true;
  return Math.floor(Date.now() / 1000) >= expSeconds;
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_TOKEN": {
      const token = action.payload;
      if (token) localStorage.setItem(LS_KEY, token);
      else localStorage.removeItem(LS_KEY);

      const user = token ? parseAccessToken(token) : null;
      return {
        ...state,
        accessToken: token,
        user,
        isAuthenticated: !!user,
        loading: false,
      };
    }
    case "DONE_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setToken = useCallback((token) => {
    dispatch({ type: "SET_TOKEN", payload: token });
  }, []);

  // --- LOGIN ---
  const login = useCallback(async ({ username, password }) => {
    // 1. Gọi API
    const res = await loginAPI({ username, password });
    const data = res.data; 
    
    // 2. Lưu token vào Context & LocalStorage
    if (data?.token) {
        setToken(data.token);
    }
    return data; // Trả data về để Login.jsx xử lý điều hướng
  }, [setToken]);

  // --- REGISTER ---
  const register = useCallback(async (registerData) => {
    const res = await registerAPI(registerData);
    return res.data;
  }, []);

  // --- LOGOUT ---
  const logout = useCallback(() => {
    setToken(null);
    // window.location.href = "/login"; // Tùy chọn nếu muốn reload sạch sẽ
  }, [setToken]);

  // --- AUTO LOAD TOKEN KHI F5 ---
  useEffect(() => {
    const token = localStorage.getItem(LS_KEY);
    if (!token) {
      dispatch({ type: "DONE_LOADING" });
      return;
    }
    const user = parseAccessToken(token);
    // Nếu token hết hạn thì xóa luôn
    if (!user || isExpired(user.exp)) {
      localStorage.removeItem(LS_KEY);
      dispatch({ type: "SET_TOKEN", payload: null });
    } else {
      dispatch({ type: "SET_TOKEN", payload: token });
    }
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
  }), [state, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}