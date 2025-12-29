"use client";

import { useEffect, useState } from "react";
import { api, getAccessToken } from "@/src/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;  // Lấy ID từ URL

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [message, setMessage] = useState("");

  // Load dữ liệu địa chỉ theo ID
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    api(`/users/addresses/${id}/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((data) => {
        setFullName(data.full_name);
        setPhone(data.phone);
        setAddressLine(data.address_line);
        setDistrict(data.district);
        setCity(data.city);
        setIsDefault(data.is_default);
      })
      .catch(() => router.push("/addresses"));
  }, []);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      const token = getAccessToken();

      await api(`/users/addresses/${id}/`, {
        method: "PUT",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
        },
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
          address_line: addressLine,
          district: district,
          city: city,
          is_default: isDefault
        })
      });

      setMessage("Cập nhật địa chỉ thành công!");
      setTimeout(() => router.push("/addresses"), 800);

    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sửa địa chỉ</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">

        <input className="border p-2" placeholder="Họ và tên"
          value={fullName} onChange={e => setFullName(e.target.value)} />

        <input className="border p-2" placeholder="Số điện thoại"
          value={phone} onChange={e => setPhone(e.target.value)} />

        <input className="border p-2" placeholder="Địa chỉ"
          value={addressLine} onChange={e => setAddressLine(e.target.value)} />

        <input className="border p-2" placeholder="Quận/Huyện"
          value={district} onChange={e => setDistrict(e.target.value)} />

        <input className="border p-2" placeholder="Thành phố"
          value={city} onChange={e => setCity(e.target.value)} />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          Đặt làm mặc định
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded"
        >
          Cập nhật
        </button>

        <p className="text-green-600 text-sm">{message}</p>

      </form>
    </div>
  );
}
