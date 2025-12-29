"use client";

import { useEffect, useState } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function ProductEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewThumb, setPreviewThumb] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api(`/products/${id}/`).then((data) => {
      setProduct(data);
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: data.category
      });
      setPreviewThumb(`${BACKEND_URL}${data.thumbnail}`);
    });
    api("/categories/").then(setCategories);
  }, [id]);

  const updateForm = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreviewThumb(URL.createObjectURL(file));
    }
  };

  const submitUpdate = async () => {
    setLoading(true);
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    if (thumbnail) data.append("thumbnail", thumbnail);
    if (images.length > 0) {
      images.forEach((img) => data.append("images", img));
    }

    try {
      await api(`/products/${id}/`, {
        method: "PUT",
        authenticated: true,
        body: data,
      });
      router.push("/admin/products");
    } catch (error) {
      alert("Lỗi cập nhật sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chỉnh sửa sản phẩm #{id}</h1>
          <button onClick={() => router.back()} className="text-sm font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">Hủy</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên sản phẩm</label>
              <input
                value={form.name || ""}
                className="w-full border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-gray-50 focus:bg-white"
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả chi tiết</label>
              <textarea
                rows={5}
                value={form.description || ""}
                className="w-full border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-gray-50 focus:bg-white"
                onChange={(e) => updateForm("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá bán (₫)</label>
                <input
                  type="number"
                  value={form.price || ""}
                  className="w-full border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50"
                  onChange={(e) => updateForm("price", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Danh mục</label>
                <select
                  value={form.category || ""}
                  className="w-full border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 cursor-pointer"
                  onChange={(e) => updateForm("category", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-left ml-1">Ảnh đại diện (Thumbnail)</label>
              <div className="relative group w-full aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {previewThumb ? (
                  <img src={previewThumb} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <span className="text-gray-300">Chưa có ảnh</span>
                )}
                <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-bold text-sm">
                  Thay đổi ảnh
                  <input type="file" className="hidden" onChange={handleThumbChange} />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Thêm ảnh chi tiết</label>
              <input
                type="file"
                multiple
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
              />
            </div>

            <button
              disabled={loading}
              onClick={submitUpdate}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Cập nhật sản phẩm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}