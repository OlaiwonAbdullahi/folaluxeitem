"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, api } from "@/lib/api";

interface AdminAuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  async function checkAuth() {
    try {
      const response = await api.getMe();
      if (response.data.role === "admin") {
        setUser(response.data);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await api.login({ email, password });
    if (response.data.user.role !== "admin") {
      throw new Error("Unauthorized: Admin access only");
    }
    localStorage.setItem("adminToken", response.data.token);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
