"use client"

import { useState, useEffect, use } from "react"
import { api } from "@/src/lib/api"

export default function CategoriesPage(){
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<any>(null)

    const [form, setForm] =  useState({
      name: "",
      slug: "",
    })


    const loadCategories= () => {
       api("/categories/")
        .then(setCategories)
        .finally (()=> setLoading(false))
    }

    useEffect(()=>{
        loadCategories()
    },[])

    const updateForm = (field: string, value: any) => {
      setForm({...form, [field]: value});
    };

    const openModal = (category: any = null) => {
      if (category){
        setForm({
          name: category.name, 
          slug: category.slug
        })
      }else{
        setForm({
          name: "",
          slug: ""
        })
      }

      setEditingCategory(category)
      setShowModal(true)
    }

    const saveCategory = async ()=> {
      try{
        if(editingCategory){
          await api(`/categories/${editingCategory.id}/`, {
            method: "PUT",
            authenticated: true,
            body: JSON.stringify(form)
          })
        }else{
          await api(`/categories/`,{
            method: "POST",
            authenticated: true,
            body: JSON.stringify(form)
          })
        }
        setShowModal(false);
        loadCategories()
      }catch (errr){
        alert("Lỗi khi lưu danh mục!")
      }
    }

    const deleteCategory = async (id: number) => {
      if(!confirm("Bạn muốn xóa danh mục này?")) return;

      await api(`/categories/${id}/`,{
        method: "DELETE",
        authenticated: true,
      })

      loadCategories();
    }


    if (loading) return <p>Đang tải,....</p>
    return(
      <div>
        <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>
        <button
        onClick={() => openModal(null)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Thêm danh mục
      </button>
        <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Danh mục</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c: any) => (
            <tr key={c.id} className="border-b">
              <td className="p-3">{c.id}</td>
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.slug}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => openModal(c)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => deleteCategory(c.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal &&(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
            </h2>
            <div className="space-y-3">
              <input
                placeholder="Name"
                className="border w-full p-2 rounded"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />
              <input
                placeholder="slug"
                className="border w-full p-2 rounded"
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Hủy
                </button>
                <button
                  onClick={saveCategory}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
    )
}
