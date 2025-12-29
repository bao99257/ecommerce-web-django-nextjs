"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, BACKEND_URL } from "@/src/lib/api";

export default function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    api("/products/", { authenticated: true })
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    if (!confirm("Bạn chắc muốn xoá sản phẩm này?")) return;

    await api(`/products/${id}/`, {
      method: "DELETE",
      authenticated: true,
    });

    loadProducts();
  };

  const toggleActive = async (product: any) => {
    await api(`/products/${product.id}/`, {
      method: "PUT",
      authenticated: true,
      body: JSON.stringify({ is_active: !product.is_active }),
    });

    loadProducts();
  };

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>

      <Link
        href="/admin/products/create"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        + Thêm Sản Phẩm
      </Link>

      <table className="w-full bg-white shadow rounded mt-4">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 text-left">Ảnh</th>
            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-left">Giá</th>
            <th className="p-3 text-left">Phân loại</th>
            <th className="p-3 text-left">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-3">
                <img
                  src={BACKEND_URL + p.thumbnail}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="p-3">{p.name}</td>
              <td className="p-3 text-red-600 font-semibold">
                {p.price.toLocaleString("vi-VN")}₫
              </td>
              <td className="p-3">
                {p.category_name}
              </td>
              <td className="p-3 flex gap-2">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Sửa
                </Link>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
