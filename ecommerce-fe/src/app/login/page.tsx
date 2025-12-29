"use client";

import { useState } from "react";
import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api("/users/login/", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      document.cookie = `access=${res.access}; path=/;`;
      document.cookie = `refresh=${res.refresh}; path=/;`;
      refreshUser();
      router.push("/");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto mt-6 mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl" >
      <h1 className="text-2xl mb-4 font-bold">Đăng nhập</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Mật khẩu"
          type="password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white p-2 rounded">Đăng nhập</button>

        <p className="text-sm text-red-500">{message}</p>
      </form>
      <Link href={"/register"}>Đăng ký</Link>
    </div>
  );
}
