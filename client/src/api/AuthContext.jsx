import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { axiosClient } from "../api/axiosClient";

const AuthContext = createContext(null);
const LS_KEY = "hm_token";

const initialState = {
  accessToken: null,
  user: null, // { username, accountTypeID, accountTypeName, exp }
  isAuthenticated: false,
  loading: true,
};

function parseAccessToken(token) {
  const p = jwtDecode(token);
  return {
    username: p.username,
    accountTypeID: p.accountTypeID,
    accountTypeName: p.accountTypeName,
    exp: p.exp, // seconds
  };
}

function isExpired(expSeconds) {
  if (!expSeconds) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= expSeconds;
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
        isAuthenticated: !!token,
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

  const login = useCallback(async ({ username, password }) => {
    // Backend bạn: POST /api/auth/login -> { token, accountTypeID, accountTypeName }
    const res = await axiosClient.post("/api/auth/login", { username, password });

    const token = res.data?.token;
    if (!token) throw new Error("Login response không có token");

    setToken(token);
    return res.data;
  }, [setToken]);

  const register = useCallback(async ({ username, password }) => {
    // Backend bạn: POST /api/auth/register
    const res = await axiosClient.post("/api/auth/register", { username, password });
    return res.data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  // Hydrate khi reload app
  useEffect(() => {
    const token = localStorage.getItem(LS_KEY);
    if (!token) {
      dispatch({ type: "DONE_LOADING" });
      return;
    }

    try {
      const user = parseAccessToken(token);
      if (isExpired(user.exp)) {
        localStorage.removeItem(LS_KEY);
        dispatch({ type: "DONE_LOADING" });
        return;
      }
      setToken(token);
    } catch {
      localStorage.removeItem(LS_KEY);
      dispatch({ type: "DONE_LOADING" });
    }
  }, [setToken]);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    setToken,
  }), [state, login, register, logout, setToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
