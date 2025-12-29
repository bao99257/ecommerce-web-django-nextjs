"use client";

import { useState, useEffect } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [statusValue, setStatusValue] = useState("");

  // Load all orders
  const loadOrders = () => {
    api("/orders/admin/", { authenticated: true })
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Open modal
  const openModal = (order: any) => {
    setSelectedOrder(order);
    setStatusValue(order.status);
    setShowModal(true);
  };

  // Save new status
  const updateStatus = async () => {
    await api(`/orders/admin/${selectedOrder.id}/status/`, {
      method: "PUT",
      authenticated: true,
      body: JSON.stringify({ status: statusValue }),
    });

    setShowModal(false);
    loadOrders();
  };

  // Badge UI theo trạng thái
  const statusBadge = (status: string) => {
    const colors: any = {
      PENDING: "bg-yellow-400",
      CONFIRMED: "bg-blue-400",
      SHIPPING: "bg-purple-400",
      COMPLETED: "bg-green-500",
      CANCELLED: "bg-red-500",
    };

    return (
      <span
        className={`px-2 py-1 text-white text-sm rounded ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-5">Quản lý đơn hàng</h1>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 text-left">Người đặt</th>
            <th className="p-3 text-left">Tổng tiền</th>
            <th className="p-3 text-left">Trạng thái</th>
            <th className="p-3 text-left">Ngày tạo</th>
            <th className="p-3 text-left">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id} className="border-b">
              <td className="p-3">{order.address_snapshot?.full_name}</td>

              <td className="p-3 font-semibold text-red-600">
                {order.total_price.toLocaleString("vi-VN")}₫
              </td>

              <td className="p-3">{statusBadge(order.status)}</td>

              <td className="p-3">
                {new Date(order.created_at).toLocaleString("vi-VN")}
              </td>

              <td className="p-3 flex gap-2">
                <button
                  onClick={() => openModal(order)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Xem & Cập nhật
                </button>

                {/* OPTIONAL: Xóa đơn */}
                {/* <button
                  onClick={() => deleteOrder(order.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Xóa
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Cập nhật trạng thái đơn{" "}
                <span className="text-blue-600">#{selectedOrder.id}</span>
              </h2>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Thông tin khách hàng */}
              <div className="space-y-3">
                <div className="flex flex-col border-b border-gray-50 pb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Người nhận
                  </span>
                  <span className="text-gray-700 font-medium">
                    {selectedOrder.address_snapshot?.full_name}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-50 pb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Địa chỉ & Liên hệ
                  </span>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {selectedOrder.address_snapshot?.street},{" "}
                    {selectedOrder.address_snapshot?.city}
                  </span>
                  <span className="text-gray-700 text-sm">
                    {selectedOrder.address_snapshot?.phone}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Tổng tiền
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {Number(selectedOrder.total_price).toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Thanh toán
                    </span>
                    <span className="text-gray-700 text-sm font-medium">
                      {selectedOrder.payment_method}
                    </span>
                  </div>
                </div>
              </div>
              {/* Thêm phần này vào giữa Body, sau đoạn Thông tin khách hàng và trước đoạn Trạng thái */}
              <div className="mt-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                  Sản phẩm đã đặt ({selectedOrder.items.length})
                </label>

                <div className="max-height-[200px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      {/* Ảnh sản phẩm - Dùng BACKEND_URL nếu ảnh là đường dẫn tương đối */}
                      <img
                        src={BACKEND_URL +item.product.thumbnail}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-white border border-gray-200"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {Number(item.price_at_order).toLocaleString()}đ x{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-700">
                          {(
                            item.price_at_order * item.quantity
                          ).toLocaleString()}
                          đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Trạng thái */}
              <div className="mt-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Trạng thái đơn hàng
                </label>
                <select
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                >
                  <option value="PENDING text-gray-400">PENDING</option>
                  <option value="CONFIRMED" className="text-blue-600">
                    CONFIRMED
                  </option>
                  <option value="SHIPPING" className="text-orange-600">
                    SHIPPING
                  </option>
                  <option value="COMPLETED" className="text-green-600">
                    COMPLETED
                  </option>
                  <option value="CANCELLED" className="text-red-600">
                    CANCELLED
                  </option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hủy
              </button>

              <button
                onClick={updateStatus}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-95"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
