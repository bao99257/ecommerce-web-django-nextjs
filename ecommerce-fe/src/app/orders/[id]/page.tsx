"use client";

import { useEffect, useState } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api(`/orders/${id}/`, { authenticated: true })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.status === 401) {
          router.push("/login");
        }
      });
  }, [id]);

  if (loading) return <p className="p-8">Đang tải đơn hàng...</p>;
  if (!order) return <p className="p-8">Không tìm thấy đơn hàng</p>;

  // Hàm hủy đơn
  const cancelOrder = async () => {
    const confirmCancel = confirm("Bạn có chắc muốn hủy đơn hàng này?");
    if (!confirmCancel) return;

    setCancelling(true);

    await api(`/orders/${id}/cancel/`, {
      method: "POST",
      authenticated: true,
    });

    // Reload lại trang
    const updated = await api(`/orders/${id}/`, { authenticated: true });
    setOrder(updated);

    setCancelling(false);
  };

  const total = (+order.total_price) + (+order.shipping_fee);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>

      {/* TRẠNG THÁI ĐƠN */}
      <div className="border p-4 rounded">
        <p className="text-lg font-semibold">Trạng thái:</p>
        <p className="text-xl font-bold mt-1">
          {order.status === "PENDING" && (
            <span className="text-yellow-600">Chờ xác nhận</span>
          )}
          {order.status === "CONFIRMED" && (
            <span className="text-blue-600">Đã xác nhận</span>
          )}
          {order.status === "SHIPPING" && (
            <span className="text-purple-600">Đang giao hàng</span>
          )}
          {order.status === "COMPLETED" && (
            <span className="text-green-600">Hoàn thành</span>
          )}
          {order.status === "CANCELLED" && (
            <span className="text-red-600">Đã hủy</span>
          )}
        </p>
      </div>

      {/* ĐỊA CHỈ GIAO HÀNG */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
        <p className="text-sm text-gray-700">
          Tên: {order.address_snapshot?.full_name} | Địa chỉ:{order.address_snapshot?.street} - {order.address_snapshot?.city}
          {/* {order.address_snapshot}   */}
        </p>
        <p className="text-sm">{order.shipping_address?.address}</p>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Sản phẩm</h2>

        {order.items.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between py-3 border-b last:border-0"
          >
            <div className="flex gap-3">
              <img
                src={BACKEND_URL + item.product.thumbnail}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-gray-600">
                  x {item.quantity}
                </p>
              </div>
            </div>

            <p className="font-bold text-red-600">
              {(item.product.price * item.quantity).toLocaleString("vi-VN")} ₫
            </p>
          </div>
        ))}
      </div>

      {/* TỔNG TIỀN */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Tổng tiền</h2>

        <div className="flex justify-between py-1">
          <span>Tạm tính</span>
          <span>{order.total_price.toLocaleString("vi-VN")} ₫</span>
        </div>

        <div className="flex justify-between py-1">
          <span>Phí vận chuyển</span>
          <span>{order.shipping_fee.toLocaleString("vi-VN")} ₫</span>
        </div>

        <div className="flex justify-between py-2 text-lg font-bold border-t mt-2">
          <span>Tổng cộng</span>
          <span className="text-red-600">
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </div>

      {/* NÚT HỦY ĐƠN */}
      {order.status === "PENDING" && (
        <button
          onClick={cancelOrder}
          disabled={cancelling}
          className="w-full bg-red-600 text-white p-4 rounded-lg font-bold"
        >
          {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
        </button>
      )}
    </div>
  );
}
