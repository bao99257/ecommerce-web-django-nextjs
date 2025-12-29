"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: any) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // 👈 lấy URL hiện tại

  useEffect(() => {
    api("/users/me/", { authenticated: true })
      .then((user) => {
        if (!user.is_staff) redirect("/");
        setLoading(false);
      })
      .catch(() => redirect("/login"));
  }, []);

  if (loading) return <p>Đang kiểm tra quyền admin...</p>;

  // Helper: kiểm tra active
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className="w-60 h-screen fixed bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <Link
            href="/admin"
            className={`block p-2 rounded ${
              isActive("/admin") && !isActive("/admin/users") &&
              !isActive("/admin/products") &&
              !isActive("/admin/categories") &&
              !isActive("/admin/orders") &&
              !isActive("/admin/reviews")
                ? "bg-blue-600 text-white"   // ACTIVE
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/users"
            className={`block p-2 rounded ${
              isActive("/admin/users")
                ? "bg-blue-600 text-white"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Người dùng
          </Link>

          <Link
            href="/admin/products"
            className={`block p-2 rounded ${
              isActive("/admin/products")
                ? "bg-blue-600 text-white"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Sản phẩm
          </Link>

          <Link
            href="/admin/categories"
            className={`block p-2 rounded ${
              isActive("/admin/categories")
                ? "bg-blue-600 text-white"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Danh mục
          </Link>

          <Link
            href="/admin/orders"
            className={`block p-2 rounded ${
              isActive("/admin/orders")
                ? "bg-blue-600 text-white"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Đơn hàng
          </Link>

          <Link
            href="/admin/reviews"
            className={`block p-2 rounded ${
              isActive("/admin/reviews")
                ? "bg-blue-600 text-white"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Đánh giá
          </Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="ml-60 p-6">{children}</main>
    </div>
  );
}
