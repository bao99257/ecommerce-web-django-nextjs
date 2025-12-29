"use client";

import { useEffect, useState } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [cart, setCart] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      api("/users/addresses/", { authenticated: true }),
      api("/cart/", { authenticated: true }),
    ])
      .then(([addrData, cartData]) => {
        setAddresses(addrData);
        setCart(cartData);
        const defaultAddr = addrData.find((a: any) => a.is_default);
        setSelectedAddress(defaultAddr ? defaultAddr.id : (addrData[0]?.id || null));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!cart || !addresses.length) return (
    <div className="max-w-xl mx-auto mt-20 text-center p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
      <p className="text-gray-500 font-medium text-lg">Vui lòng thêm địa chỉ giao hàng trước khi thanh toán.</p>
    </div>
  );

  const subtotal = cart.items.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = 25000;
  const total = subtotal + shippingFee;

  const placeOrder = async () => {
    if (!selectedAddress) return alert("Vui lòng chọn địa chỉ giao hàng");
    setPlacingOrder(true);

    try {
      const res = await api("/orders/checkout/", {
        method: "POST",
        authenticated: true,
        body: JSON.stringify({
          address_id: selectedAddress,
          payment_method: paymentMethod,
          shipping_fee: shippingFee,
        }),
      });

      if (paymentMethod === "COD") {
        router.push(`/order-success?order=${res.order_id}`);
      } else if (paymentMethod === "VNPAY") {
        const payRes = await api("/payment/vnpay/", {
          method: "POST",
          authenticated: true,
          body: JSON.stringify({ order_id: res.order_id }),
        });
        window.location.href = payRes.payment_url;
      }
    } catch (err) {
      alert("Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Thanh toán</h1>

          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
              Địa chỉ giao hàng
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedAddress === addr.id ? "border-blue-600 bg-blue-50/30" : "border-gray-50 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{addr.full_name}</span>
                      <span className="text-gray-400 text-xs font-medium">| {addr.phone}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{addr.street}, {addr.district}, {addr.city}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "COD" ? "border-blue-600 bg-blue-50/30" : "border-gray-50 hover:border-gray-200"}`}>
                <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-gray-700">Tiền mặt (COD)</span>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "VNPAY" ? "border-blue-600 bg-blue-50/30" : "border-gray-50 hover:border-gray-200"}`}>
                <input type="radio" checked={paymentMethod === "VNPAY"} onChange={() => setPaymentMethod("VNPAY")} className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-gray-700 font-italic text-blue-800 italic">VNPAY</span>
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
            
            <div className="max-h-[300px] overflow-y-auto space-y-4 mb-6 pr-2">
              {cart.items.map((item: any) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                    <img src={`${BACKEND_URL}${item.product.thumbnail}`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-400">Số lượng: {item.quantity}</p>
                    <p className="text-sm font-black text-gray-700 mt-1">{(item.product.price * item.quantity).toLocaleString()}₫</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Tạm tính</span>
                <span className="font-medium">{subtotal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Phí vận chuyển</span>
                <span className="font-medium">{shippingFee.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-gray-900 font-bold">Tổng thanh toán</span>
                <span className="text-2xl font-black text-red-600 tracking-tighter">{total.toLocaleString()}₫</span>
              </div>
            </div>

            <button
              disabled={placingOrder}
              onClick={placeOrder}
              className="w-full mt-8 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placingOrder ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Đảm bảo an toàn • Bảo mật 100%</p>
          </div>
        </div>

      </div>
    </div>
  );
}