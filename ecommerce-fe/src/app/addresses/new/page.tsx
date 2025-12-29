"use client";
import { useState } from "react";
import { api, getAccessToken } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function NewAddressPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async(e : any) => {
    e.preventDefault();

    try{
        const token = getAccessToken();
        await api("/users/addresses/", {
            method: "POST",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            
            },
            body: JSON.stringify({
                full_name: fullName,
                phone: phone,
                street: street,
                district: district,
                city: city,
                is_default: isDefault
            })
        });
        setMessage("Thêm địa chỉ thành công!");
        setTimeout(() => router.push("/addresses"), 800);
    }catch(error: any){
        setMessage(error.message)
    }
  };
  return(
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thêm địa chỉ mới</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input className="border p-2" placeholder="Họ và tên"
          value={fullName} onChange={e => setFullName(e.target.value)} />

        <input className="border p-2" placeholder="Số điện thoại"
          value={phone} onChange={e => setPhone(e.target.value)} />

        <input className="border p-2" placeholder="Địa chỉ (số nhà, đường)"
          value={street} onChange={e => setStreet(e.target.value)} />

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
          Đặt làm địa chỉ mặc định
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Lưu địa chỉ
        </button>

        <p className="text-green-600 text-sm">{message}</p>

      </form>
    </div>
  )
}
