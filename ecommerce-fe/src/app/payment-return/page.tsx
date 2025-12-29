"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentReturnPage() {
  const params = useSearchParams();

  const orderId = params.get("order");
  const success = params.get("success"); // "1" = success, "0" = fail
  const message = params.get("msg") || "";

  useEffect(() => {
    if (success === "1") {
      // Tự động redirect sau 1.5 giây
      setTimeout(() => {
        window.location.href = `/order-success?order=${orderId}`;
      }, 1500);
    }
  }, [success, orderId]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {success === "1" ? (
        <>
          <div className="text-green-600 text-6xl mb-4">✔</div>
          <h1 className="text-3xl font-bold mb-3">Thanh toán thành công!</h1>
          <p className="text-lg mb-4">
            Đơn hàng #{orderId} đã được thanh toán qua VNPAY.
          </p>
          <p className="text-gray-600 mb-6">Đang chuyển hướng...</p>
        </>
      ) : (
        <>
          <div className="text-red-600 text-6xl mb-4">✖</div>
          <h1 className="text-3xl font-bold mb-3">Thanh toán thất bại</h1>

          <p className="text-lg mb-4">Đơn hàng: #{orderId}</p>

          <p className="text-red-600 font-semibold mb-6">
            {message || "Có lỗi xảy ra trong quá trình thanh toán."}
          </p>

          <Link
            href={`/orders/${orderId}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
          >
            Xem đơn hàng
          </Link>

          <Link
            href="/"
            className="mt-4 inline-block text-gray-700 underline"
          >
            Quay lại trang chủ
          </Link>
        </>
      )}
    </div>
  );
}
