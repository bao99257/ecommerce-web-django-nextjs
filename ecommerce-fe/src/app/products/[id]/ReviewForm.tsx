"use client";

import { useState } from "react";
import { api } from "@/src/lib/api";
import { redirect } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function ReviewForm({ productId, reviews, reload }: any) {
  const { user, loading } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (loading) return null;
  if (!user) {
    return (
      <p className="text-blue-600 bg-blue-50 p-4 rounded-lg">
        Hãy đăng nhập để đánh giá sản phẩm.
      </p>
    );
  }

  // Kiểm tra xem user đã review chưa
  const access =
    typeof document !== "undefined"
      ? document.cookie.includes("access")
      : false;

  if (!access)
    return <p className="text-blue-600">Hãy đăng nhập để đánh giá.</p>;
  console.log("Current User:", user);
  console.log("All Reviews:", reviews);     
  const myReview = reviews.find((r: any) => r.user === user.id);
  // BE không gửi user_id, chỉ user_name, nên ta dùng user_id FE không biết.
  // → Cách đúng: BE phải gửi user_id. Tớ sẽ fix BE ở bên dưới.

  // Nếu user đã review → ẩn form
  if (myReview)
    return (
      <p className="text-green-600 font-semibold">
        Bạn đã đánh giá sản phẩm này rồi.
      </p>
    );

  const submitReview = async () => {
    setError("");

    try {
      await api(`/review/${productId}/`, {
        method: "POST",
        authenticated: true,
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      reload();
      setComment("");
    } catch (err: any) {
      setError("Bạn chỉ có thể đánh giá khi đã mua sản phẩm.");
    }
  };

  return (
    <div className="border p-4 rounded-lg mb-6">
      <h3 className="font-semibold mb-3">Gửi đánh giá của bạn</h3>

      {error && <p className="text-red-600">{error}</p>}

      {/* chọn rating */}
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded mb-3"
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <option key={i} value={i}>
            {i} sao
          </option>
        ))}
      </select>

      {/* comment */}
      <textarea
        placeholder="Nhập nội dung đánh giá..."
        className="border w-full p-2 rounded mb-3"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submitReview}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Gửi đánh giá
      </button>
    </div>
  );
}
