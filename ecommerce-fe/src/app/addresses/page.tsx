"use client";

import { useEffect, useState } from "react";
import { api, getAccessToken } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddressListPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = () => {
    api("/users/addresses/", { // Đảm bảo có dấu / ở cuối
      method: "GET",
      authenticated: true,
    })
      .then((data) => {
        setAddresses(data);
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) return;
    
    try {
      await api(`/users/addresses/${id}/`, {
        method: "DELETE",
        authenticated: true,
      });
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (error) {
      alert("Không thể xóa địa chỉ. Vui lòng thử lại.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sổ địa chỉ</h1>
          <p className="text-gray-500 text-sm">Quản lý các địa điểm nhận hàng của bạn</p>
        </div>
        <Link
          href="/addresses/new"
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-gray-200"
        >
          + Thêm mới
        </Link>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">Bạn chưa có địa chỉ nào.</p>
          </div>
        ) : (
          addresses.map((addr: any) => (
            <div 
              key={addr.id} 
              className={`relative bg-white p-6 rounded-2xl border-2 transition-all ${
                addr.is_default ? "border-blue-600 shadow-md" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{addr.full_name}</span>
                    {addr.is_default && (
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{addr.phone}</p>
                  <p className="text-gray-600 text-sm leading-relaxed pt-2">
                    {addr.street}<br />
                    {addr.district}, {addr.city}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-gray-50">
                <Link
                  href={`/addresses/${addr.id}/edit`}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Chỉnh sửa
                </Link>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <button 
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
        >
          ← Quay lại hồ sơ
        </button>
      </div>
    </div>
  );
}