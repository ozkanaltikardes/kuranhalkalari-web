"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function EditPost() {
  const router = useRouter();
  const params = useParams(); // URL'deki [id] numarasını buradan alıyoruz
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    language: "tr",
    image_url: "",
    is_published: true
  });

  // Sayfa açılınca: Eski verileri çek ve kutulara doldur
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Yazı bulunamadı!");
        router.push("/admin/dashboard");
      } else if (data) {
        setFormData(data);
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, router]);

  // Güncelleme İşlemi
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          language: formData.language,
          image_url: formData.image_url,
        })
        .eq("id", id); // Sadece bu ID'ye sahip yazıyı güncelle

      if (error) throw error;

      alert("Yazı güncellendi!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Veriler yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Yazıyı Düzenle</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 border rounded text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">URL (Slug)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full p-2 border rounded bg-gray-50 text-gray-600 text-sm"
            />
          </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Resmi</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full p-3 border rounded text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
            <textarea
              required
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-3 border rounded text-black"
            ></textarea>
          </div>

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
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}