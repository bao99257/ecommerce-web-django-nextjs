"use client";

import { useEffect, useState } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function ProductCreate() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    api("/categories/")
      .then(setCategories)
      .catch(console.error);
  }, []);

  const updateForm = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const submitProduct = async () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, (form as any)[key]);
    });

    if (thumbnail) data.append("thumbnail", thumbnail);

    images.forEach((img) => data.append("images", img));

    try {
      await api(`/products/`, {
        method: "POST",
        authenticated: true,
        credentials: "include",
        body: data,
      });

      router.push("/admin/products");
    } catch (error) {
      alert("Lỗi tạo sản phẩm");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Thêm sản phẩm</h1>

      <div className="space-y-3 mt-6">
        <input
          placeholder="Tên sản phẩm"
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("name", e.target.value)}
        />
        <input
          placeholder="Slug"
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("slug", e.target.value)}
        />
        <textarea
          placeholder="Mô tả"
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("description", e.target.value)}
        />

        <input
          type="number"
          placeholder="Giá"
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("price", e.target.value)}
        />

        <input
          type="number"
          placeholder="Số lượng tồn kho"
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("stock", e.target.value)}
        />

        <select
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("category", e.target.value)}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Thumbnail:</label>
        <input
          type="file"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        />

        <label>Hình ảnh:</label>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files || []))}
        />

        <button
          onClick={submitProduct}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Tạo sản phẩm
        </button>
      </div>
    </div>
  );
}
