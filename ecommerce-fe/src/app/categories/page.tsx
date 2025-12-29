"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import Link from "next/link";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/categories/")
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-lg">Đang tải...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tất cả danh mục</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {categories .map((ctg) => (
          <Link
            href={`/categories/${ctg.slug}`}
            key={ctg.id}
            className="border rounded-lg p-3 hover:shadow-lg transition"
          >
            {/* <img
              src={"http://localhost:8000" + p.thumbnail}
              className="w-full h-40 object-cover rounded"
            /> */}

            <h2 className="mt-2 font-semibold line-clamp-1">{ctg.name}</h2>

            {/* <p className="text-red-600 font-bold text-lg">
              {Number(p.price).toLocaleString("vi-VN")} ₫
            </p> */}
          </Link>
        ))}

      </div>
    </div>
  );
}
