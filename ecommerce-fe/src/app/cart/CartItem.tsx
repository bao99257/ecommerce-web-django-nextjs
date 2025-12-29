"use client";

import { api } from "@/src/lib/api";

export default function CartItem({ item, reload }: any) {

  const updateQty = async (qty: number) => {
    await api(`/cart/update/${item.id}/`, {
      method: "PUT",
      body: JSON.stringify({ quantity: qty }),
      authenticated: true, // Thêm dòng này
    });
    reload();
  };

  const removeItem = async () => {
    await api(`/cart/remove/${item.id}/`, {
      method: "DELETE",
      authenticated: true, // Thêm dòng này
    });
    reload();
  };

  return (
    <div className="flex items-center gap-4 border p-4 rounded-lg">

      <img
        src={"http://localhost:8000"+item.product.thumbnail}
        className="w-20 h-20 object-cover rounded"
      />

      <div className="flex-1">
        <p className="font-semibold">{item.product.name}</p>
        <p className="text-red-600 font-bold">
          {Number(item.product.price).toLocaleString("vi-VN")} ₫
        </p>

        {/* Tăng giảm số lượng */}
        <div className="flex items-center mt-2 gap-2">
          <button
            onClick={() => updateQty(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="px-3 py-1 border rounded"
          >
            -
          </button>

          <span className="text-lg">{item.quantity}</span>

          <button
            onClick={() => updateQty(item.quantity + 1)}
            className="px-3 py-1 border rounded"
          >
            +
          </button>
        </div>
      </div>

      {/* Xóa */}
      <button
        onClick={removeItem}
        className="text-red-600 font-semibold"
      >
        Xóa
      </button>
    </div>
  );
}
