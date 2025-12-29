"use client";

import { useEffect, useState } from "react";
import { api, getAccessToken, BACKEND_URL } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { logout } from "@/src/lib/auth";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    api("/users/me/", {
      method: "GET",
      authenticated: true, // Sử dụng logic đã có trong hàm api của bạn
    })
      .then((data) => setUser(data))
      .catch(() => router.push("/login"));
  }, []);

  if (!user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:space-x-5">
            <div className="relative h-32 w-32 rounded-3xl border-4 border-white overflow-hidden shadow-lg bg-gray-100">
              <img
                src={user.avatar ? `${BACKEND_URL}${user.avatar}` : "https://via.placeholder.com/150"}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-6 sm:mt-0 text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>
            <div className="mt-6 sm:mt-0 flex space-x-3">
              <Link
                href="/profile/edit"
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-md"
              >
                Chỉnh sửa
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cột trái: Thông tin cá nhân */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Thông tin tài khoản</h3>
              
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Họ và tên</span>
                <span className="text-gray-700 font-medium">{user.full_name || "Chưa cập nhật"}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Địa chỉ Email</span>
                <span className="text-gray-700 font-medium">{user.email}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Số điện thoại</span>
                <span className="text-gray-700 font-medium">{user.phone || "Chưa cập nhật"}</span>
              </div>
            </div>

            {/* Cột phải: Lối tắt quản lý */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Quản lý</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <Link 
                  href="/addresses" 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 group transition-all border border-transparent hover:border-blue-100"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Sổ địa chỉ</span>
                    <span className="text-xs text-gray-500">Quản lý địa chỉ giao hàng của bạn</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-600">→</span>
                </Link>

                <Link 
                  href="/orders" 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 group transition-all border border-transparent hover:border-blue-100"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Đơn hàng của tôi</span>
                    <span className="text-xs text-gray-500">Theo dõi lịch sử mua sắm</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-600">→</span>
                </Link>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="w-full mt-4 flex items-center justify-center space-x-2 py-3 border-2 border-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-[0.98]"
              >
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center mt-8 text-gray-400 text-sm">
        ID Người dùng: #{user.id} • Thành viên từ 2025
      </p>
    </div>
  );
}