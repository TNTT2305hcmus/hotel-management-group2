import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginAPI, registerAPI } from "../services/authService"; 

const AuthContext = createContext(null);
const LS_KEY = "hm_token"; // key save token to localStorage

const initialState = {
  accessToken: null,
  user: null, 
  isAuthenticated: false,
  loading: true,
};

// decode jwt token -> object
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

// Takcle token's state
function reducer(state, action) {
  switch (action.type) {
    case "SET_TOKEN": {
      const token = action.payload;
      // Token -> save to localStorage
      // ! Token -> remove localStorage -> reset state
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
      // when loading == true -> UI is reading localStorage -> take user information (F5)
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
    // call API to login
    const res = await loginAPI({ username, password });
    const data = res.data; 
    
    // save token to localStorage
    if (data?.token) {
        setToken(data.token);
    }
    return data; // return data for Login.jsx diverts
  }, [setToken]);

  // --- REGISTER ---
  const register = useCallback(async (registerData) => {
    // call API to register
    const res = await registerAPI(registerData);
    return res.data;
  }, []);

  // --- LOGOUT ---
  const logout = useCallback(() => {
    // reducer automatically delete localStorage -> set state to init state
    setToken(null);
  }, [setToken]);

  // --- UI load token from localStorage when F5 ---
  useEffect(() => {
    const token = localStorage.getItem(LS_KEY);
    if (!token) {
      dispatch({ type: "DONE_LOADING" });
      return;
    }
    const user = parseAccessToken(token);
    // If token is expired -> delete token
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

// custom hook
export function useAuth() {
  return useContext(AuthContext);
}