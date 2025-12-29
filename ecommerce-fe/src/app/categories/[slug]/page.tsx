"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();

  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/categories/${slug}/products/`)
      .then((data) => {
        setCategoryName(data.category);
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

      {products.length === 0 && <p>Chưa có sản phẩm nào.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((p) => (
          <Link
            href={`/products/${p.id}`}
            key={p.id}
            className="border p-3 rounded hover:shadow"
          >
            <img
              src={"http://localhost:8000" +p.thumbnail}
              className="w-full h-40 object-cover rounded"
            />

            <h2 className="font-semibold line-clamp-1 mt-2">{p.name}</h2>

            <p className="text-red-600 font-bold">
              {Number(p.price).toLocaleString("vi-VN")} ₫
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
