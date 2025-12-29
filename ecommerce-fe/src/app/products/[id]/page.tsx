"use client";

import { useCallback, useEffect, useState } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { addToCart } from "@/src/lib/cart";
import ReviewForm from "./ReviewForm";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(() => {
    api(`/products/${id}/`)
      .then((data) => {
        setProduct(data);
        if (!mainImage) setMainImage(data.thumbnail);
        setLoading(false);

        api(`/products/?category=${data.category}`).then((rel) =>
          setRelatedProducts(rel.filter((p: any) => p.id != data.id))
        );
      })
      .catch(() => setLoading(false));
  }, [id, mainImage]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if (!product) return <p className="p-8 text-center text-gray-500 font-bold">Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* CỘT TRÁI: HÌNH ẢNH */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              src={`${BACKEND_URL}${mainImage || product.thumbnail}`}
              className="w-full h-full object-contain mix-blend-multiply transition-all duration-500"
              alt={product.name}
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            <div 
              onClick={() => setMainImage(product.thumbnail)}
              className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${mainImage === product.thumbnail ? 'border-blue-600 shadow-md' : 'border-transparent bg-gray-50'}`}
            >
              <img src={`${BACKEND_URL}${product.thumbnail}`} className="w-full h-full object-cover" />
            </div>

            {product.images.map((img: any) => (
              <div
                key={img.id}
                onClick={() => setMainImage(img.image)}
                className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${mainImage === img.image ? 'border-blue-600 shadow-md' : 'border-transparent bg-gray-50'}`}
              >
                <img src={`${BACKEND_URL}${img.image}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className="flex flex-col">
          <nav className="flex text-sm text-gray-400 mb-4 font-bold uppercase tracking-widest">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.category_name}</span>
          </nav>

          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tighter">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="bg-red-50 px-4 py-2 rounded-2xl">
              <p className="text-red-600 text-3xl font-black tracking-tighter">
                {Number(product.price).toLocaleString("vi-VN")}₫
              </p>
            </div>
            {product.stock > 0 ? (
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Còn hàng ({product.stock})</span>
            ) : (
              <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Hết hàng</span>
            )}
          </div>

          <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed">
            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Mô tả sản phẩm</p>
            {product.description}
          </div>

          <div className="mt-auto space-y-4">
            <button
              onClick={async () => {
                try {
                  await addToCart(product.id, 1);
                  window.location.href = "/cart";
                } catch {
                  alert("Vui lòng đăng nhập để mua hàng!");
                }
              }}
              className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-gray-200 transition-all active:scale-[0.98]"
            >
              Thêm vào giỏ hàng
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mien phí giao hàng toàn quốc đơn từ 500k</p>
          </div>
        </div>
      </div>

      <hr className="my-20 border-gray-100" />

      {/* ĐÁNH GIÁ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">Đánh giá khách hàng</h2>
          <ReviewForm productId={id} reviews={product.reviews} reload={loadProduct} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {product.reviews.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium italic">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((r: any) => (
                <div key={r.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-900">{r.user_name}</p>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(r.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex text-amber-400 text-xs mb-3">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{r.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-32">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Sản phẩm liên quan</h2>
          <Link href="/" className="text-sm font-bold text-blue-600 hover:underline">Xem tất cả →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {relatedProducts.map((p) => (
            <Link
              href={`/products/${p.id}`}
              key={p.id}
              className="group bg-white p-3 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all hover:shadow-xl"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                <img src={`${BACKEND_URL}${p.thumbnail}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{p.name}</p>
              <p className="text-red-600 font-black text-sm">
                {Number(p.price).toLocaleString("vi-VN")}₫
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}