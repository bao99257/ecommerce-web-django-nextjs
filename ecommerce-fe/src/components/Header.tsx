"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setOpenMenu(false);
  }, [user]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* 1. Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                className="w-auto h-8 lg:h-10"
                src="https://theme.hstatic.net/200000881795/1001243022/14/menu_icon_3.png?v=177"
                alt="Logo"
              />
              <span className="text-xl lg:text-2xl font-bold tracking-tight text-blue-600 hidden sm:block">
                KING<span className="text-black">SHOP</span>
              </span>
            </Link>
          </div>

          {/* 2. THANH SEARCH TƯỢNG TRƯNG (Ở GIỮA) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-gray-100 border-none py-2.5 pl-4 pr-10 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 3. User Actions / Navigation */}
          <div className="flex items-center gap-2">
            {!loading && !user && (
              <Link
                href="/login"
                className="inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
              >
                Đăng nhập
              </Link>
            )}

            {!loading && user &&(
              <div className="flex items-center gap-3">
                {" "}
                {/* Container bao quanh cả Cart và User */}
                {/* ICON GIỎ HÀNG */}
                <Link
                  href="/cart"
                  className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  {/* Badge số lượng sản phẩm (Ví dụ: hiện số 2) */}
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    2
                  </span>
                </Link>
                {/* ICON USER (Giữ nguyên logic của bạn) */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(!openMenu)}
                      className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      {/* Nếu có avatar thì hiện ảnh, không thì hiện icon mặc định */}
                      {user.avatar ? (
                        <img
                          src={`http://localhost:8000${user.avatar}`}
                          className="w-full h-full rounded-full object-cover"
                          alt="avatar"
                        />
                      ) : (
                        <span className="text-lg">👤</span>
                      )}
                    </button>

                    {openMenu && (
                      <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-xl border border-gray-100 p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-50 mb-1">
                          Tài khoản
                        </div>
                        {user.is_staff && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                            onClick={() => setOpenMenu(false)}
                          >
                            Quản Lý
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                          onClick={() => setOpenMenu(false)}
                        >
                          Hồ sơ
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                          onClick={() => setOpenMenu(false)}
                        >
                          Đơn hàng
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-1 font-medium"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 text-gray-600 rounded-md hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
