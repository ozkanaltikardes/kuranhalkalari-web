"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form Verileri
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    language: "tr",
    image_url: "",
  });

  // Başlık değişince otomatik URL (slug) oluştur
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Türkçe karakterleri İngilizceye çevir ve tirele (Örn: "Ilık Süt" -> "ilik-sut")
    const slug = title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    setFormData({ ...formData, title: title, slug: slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("posts").insert([
        {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          language: formData.language,
          image_url: formData.image_url,
          is_published: true, // Direkt yayına alalım
        },
      ]);

      if (error) throw error;

      alert("Yazı başarıyla eklendi!");
      router.push("/admin/dashboard"); // Listeye geri dön
    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Yeni Yazı Ekle</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full p-3 border rounded text-black"
              placeholder="Örn: Ramazan Ayının Önemi"
            />
          </div>

          {/* Slug (Otomatik) */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">URL (Otomatik oluşur)</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full p-2 border rounded bg-gray-50 text-gray-600 text-sm"
            />
          </div>

          {/* Dil ve Resim Yan Yana */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dil</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full p-3 border rounded text-black"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Resmi (URL)</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full p-3 border rounded text-black"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* İçerik */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
            <textarea
              required
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-3 border rounded text-black"
              placeholder="Yazı içeriğini buraya girin..."
            ></textarea>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Yayınla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}