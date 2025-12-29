"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api("/orders/dashboard/", { authenticated: true })
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg">Tổng số người dùng</h3>
          <p className="text-2xl font-bold">{stats.user_count}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg">Sản phẩm</h3>
          <p className="text-2xl font-bold">{stats.product_count}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg">Đơn hàng</h3>
          <p className="text-2xl font-bold">{stats.order_count}</p>
        </div>
      </div>
    </div>
  );
}
