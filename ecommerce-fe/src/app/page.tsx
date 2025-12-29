"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import Link from "next/link";

export default function ProductListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/products/")
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-lg">Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <img
        style={{ marginBottom: "30px", width: "1500px", height: "500px" }}
        src="/banner3.png"
        alt=""
      />

      <h1 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            href={`/products/${p.id}`}
            key={p.id}
            className="group bg-white border p-3 border-gray-100 rounded-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* 1. Thay h-48 bằng aspect-square */}
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
              <img
                src={"http://localhost:8000" + p.thumbnail}
                alt={p.name}
                /* 2. Nếu ảnh gốc bị cắt, hãy thử đổi object-cover thành object-contain */
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
                New
              </div>
            </div>

            <div className="mt-4 flex flex-col flex-1">
              <h2 className="text-gray-800 font-bold text-sm line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                {p.name}
              </h2>

              <div className="mt-auto pt-2 flex items-center justify-between">
                <p className="text-red-600 font-black text-lg tracking-tight">
                  {Number(p.price).toLocaleString("vi-VN")}
                  <span className="text-xs ml-0.5">₫</span>
                </p>

                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="text-sm">+</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
