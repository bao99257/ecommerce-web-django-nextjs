"use client";

import { useState, useEffect } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  const [form, setForm] = useState({
    comment: "",
    rating: 5,
  });

  const loadReviews = () => {
    api("/review/all/", { authenticated: true })
      .then(setReviews)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const updateForm = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const openModal = (review: any) => {
    setEditingReview(review);
    setForm({
      comment: review.comment,
      rating: review.rating,
    });
    setShowModal(true);
  };

  const saveReview = async () => {
    await api(`/review/all/${editingReview.id}/`, {
      method: "PUT",
      authenticated: true,
      body: JSON.stringify(form),
    });

    setShowModal(false);
    loadReviews();
  };

  const deleteReview = async (id: number) => {
    if (!confirm("Bạn muốn xóa đánh giá này?")) return;

    await api(`/review/all/${id}/`, {
      method: "DELETE",
      authenticated: true,
    });

    loadReviews();
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý đánh giá</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 text-left">Người đánh giá</th>
            <th className="p-3 text-left">Sản phẩm</th>
            <th className="p-3 text-left">Nội dung</th>
            <th className="p-3 text-left">Rating</th>
            <th className="p-3 text-left">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-3">{r.user_name}</td>

              

              <td className="p-3">{r.product}</td>
              <td className="p-3">{r.comment}</td>

              <td className="p-3">{r.rating} ⭐</td>

              <td className="p-3 flex gap-2">
                <button
                  onClick={() => openModal(r)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => deleteReview(r.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Sửa đánh giá</h2>

            <div className="space-y-3">
              <textarea
                className="border w-full p-2 rounded h-24"
                placeholder="Nội dung đánh giá"
                value={form.comment}
                onChange={(e) => updateForm("comment", e.target.value)}
              />

              <select
                className="border w-full p-2 rounded"
                value={form.rating}
                onChange={(e) => updateForm("rating", Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>
                    {v} ⭐
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Hủy
                </button>

                <button
                  onClick={saveReview}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
