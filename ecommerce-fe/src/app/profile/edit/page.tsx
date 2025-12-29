"use client";

import { useEffect, useState } from "react";
import { api, getAccessToken, BACKEND_URL } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    api("/users/me/", {
      method: "GET",
      authenticated: true
    }).then((data) => {
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      if (data.avatar) setPreview(`${BACKEND_URL}${data.avatar}`);
    });
  }, []);

  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const token = getAccessToken();
    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("phone", phone);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/me/update/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
        setTimeout(() => router.push("/profile"), 1200);
      } else {
        setMessage({ type: "error", text: "Không thể cập nhật hồ sơ. Vui lòng thử lại." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h1>
            <p className="text-gray-500 text-sm mt-1">Cập nhật thông tin cá nhân của bạn</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-gray-50 shadow-md bg-gray-100">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                      ?
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                  Thay đổi ảnh
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Ảnh đại diện</p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Họ và tên</label>
                <input
                  className="w-full border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="Nhập tên của bạn"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Số điện thoại</label>
                <input
                  className="w-full border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl text-sm font-medium text-center animate-in fade-in slide-in-from-top-1 ${
                message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}