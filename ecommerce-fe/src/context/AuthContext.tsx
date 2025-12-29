"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken, getRefreshToken } from "@/src/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  loading: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user info từ BE nếu có access token
  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/users/me/", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Hàm logout
  const logout = () => {
    document.cookie = "access=; Max-Age=0; path=/;";
    document.cookie = "refresh=; Max-Age=0; path=/;";
    setUser(null);
    router.push("/login");
  };

  // Hàm refresh user
  const refreshUser = () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }

    fetch("http://localhost:8000/api/users/me/", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data);
      })
      .catch(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
