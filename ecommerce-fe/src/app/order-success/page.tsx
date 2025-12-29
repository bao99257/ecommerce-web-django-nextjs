"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-green-600 text-6xl mb-4">✔</div>

      <h1 className="text-3xl font-bold mb-3">
        Đặt hàng thành công!
      </h1>

      <p className="text-lg mb-6">
        Cảm ơn bạn đã đặt hàng.  
        Mã đơn hàng của bạn là:  
        <span className="font-semibold text-blue-600"> #{orderId} </span>
      </p>

      <div className="flex gap-4">
        <Link
          href="/orders"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
        >
          Xem đơn hàng
        </Link>

        <Link
          href="/"
          className="bg-gray-200 px-6 py-3 rounded-lg text-lg"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
