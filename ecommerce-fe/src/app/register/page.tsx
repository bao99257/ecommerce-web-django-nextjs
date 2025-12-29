"use client";

import { useState } from "react";
import { api } from "@/src/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api("/users/register/", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      });
      document.cookie = `access=${res.access}; path=/;`;
      document.cookie = `refresh=${res.refresh}; path=/;`;

      setMessage("Register successful!");
    } catch (error: any) {
      setMessage(error.message);
    }
  };
  return (
    <div className="p-8 max-w-md mx-auto mt-6 mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl">
      <h1 className="text-2xl mb-4 font-bold">Đăng ký</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          placeholder="usename"
          value={fullName}
          className="border p-2 rounded"
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          className="border p-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          className="border p-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-black text-white p-2 rounded">Đăng kí</button>
        <p className="text-sm text-red-500">{message}</p>
      </form>
      <Link href={"/login"}>Đăng nhập</Link>
    </div>
  );
}
