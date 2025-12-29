"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password:"",
    is_staff: false,
    is_active: true,
  });

  // Load User List
  const loadUsers = () => {
    api("/users/admin/users/", { authenticated: true })
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle Input
  const updateForm = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  // Open modal for "create" or "edit"
  const openModal = (user: any = null) => {
    if (user) {
      setForm({
        full_name: user.full_name,
        email: user.email,
        password: user.password,
        is_staff: user.is_staff,
        is_active: user.is_active,
      });
    } else {
      setForm({
        full_name: "",
        email: "",
        password: "",
        is_staff: false,
        is_active: true,
      });
    }

    setEditingUser(user);
    setShowModal(true);
  };

  // CREATE OR UPDATE
  const saveUser = async () => {
    try {
      if (editingUser) {
        // Update
        await api(`/users/admin/users/${editingUser.id}/`, {
          method: "PUT",
          authenticated: true,
          body: JSON.stringify(form),
        });
      } else {
        // Create
        await api(`/users/admin/users/`, {
          method: "POST",
          authenticated: true,
          body: JSON.stringify(form),
        });
      }

      setShowModal(false);
      loadUsers();
    } catch (err) {
      alert("Lỗi khi lưu user");
    }
  };

  // DELETE
  const deleteUser = async (id: number) => {
    if (!confirm("Bạn chắc muốn xóa user này?")) return;

    await api(`/users/admin/users/${id}/`, {
      method: "DELETE",
      authenticated: true,
    });

    loadUsers();
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>

      <button
        onClick={() => openModal(null)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Thêm User
      </button>

      {/* USERS TABLE */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 text-left">Ảnh đại diện</th>
            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Điện thoại</th>
            <th className="p-3 text-left">Admin</th>
            <th className="p-3 text-left">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u: any) => (
            <tr key={u.id} className="border-b">
              <td className="p-3"><img style={{height: "50px",width: "50px", borderRadius: "50%"}} src={"http://localhost:8000" + u.avatar} alt="" /></td>
              <td className="p-3">{u.full_name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.phone}</td>
              <td className="p-3">{u.is_staff ? "✔" : "—"}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => openModal(u)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => deleteUser(u.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "Sửa User" : "Thêm User"}
            </h2>

            {/* FORM */}
            <div className="space-y-3">
              <input
                placeholder="Username"
                className="border w-full p-2 rounded"
                value={form.full_name}
                onChange={(e) => updateForm("full_name", e.target.value)}
              />

              <input
                placeholder="Email"
                type="email"
                className="border w-full p-2 rounded"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
              />

              <input
                placeholder="Password"
                type="password"
                className="border w-full p-2 rounded"
                value={form.password}
                onChange={(e) => updateForm("password", e.target.value)}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_staff}
                  onChange={(e) => updateForm("is_staff", e.target.checked)}
                />
                Admin
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateForm("is_active", e.target.checked)}
                />
                Active
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>

              <button
                onClick={saveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
