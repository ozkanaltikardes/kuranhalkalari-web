"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Yazı tipi tanımı
type Post = {
  id: number;
  title: string;
  language: string;
  is_published: boolean;
  created_at: string;
};

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Güvenlik Kontrolü
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin");
      } else {
        fetchPosts();
      }
    };

    checkUser();
  }, [router]);

  // Verileri Çekme Fonksiyonu
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setPosts(data);
    setLoading(false);
  };

  // EKSİK OLAN PARÇA BU: Silme Fonksiyonu
  const handleDelete = async (id: number) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      
      if (error) throw error;

      // Listeden de siliyoruz ki sayfa yenilenmeden yok olsun
      setPosts(posts.filter((post) => post.id !== id));
      alert("Yazı silindi.");
    } catch (error: any) {
      alert("Silinemedi: " + error.message);
    }
  };

  // Çıkış Yapma Fonksiyonu
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Üst Bar */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Yönetim Paneli</h1>
          <div className="space-x-4">
            <span className="text-gray-500 text-sm">Hoşgeldin, Admin</span>
            <button 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 text-sm font-semibold border border-red-200 px-3 py-1 rounded"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Yeni Ekle Butonu */}
        <div className="mb-6 text-right">
            <button 
              onClick={() => router.push("/admin/posts/new")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                + Yeni Yazı Ekle
            </button>
        </div>

        {/* Yazı Listesi Tablosu */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-gray-500 font-medium">Başlık</th>
                <th className="p-4 text-gray-500 font-medium">Dil</th>
                <th className="p-4 text-gray-500 font-medium">Durum</th>
                <th className="p-4 text-gray-500 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{post.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${post.language === 'tr' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {post.language}
                    </span>
                  </td>
                  <td className="p-4">
                    {post.is_published ? (
                      <span className="text-green-600 text-sm">Yayında</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Taslak</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {/* Düzenle Butonu */}
                    <button 
                      onClick={() => router.push(`/admin/posts/${post.id}`)} 
                      className="text-blue-600 hover:underline text-sm font-semibold"
                    >
                      Düzenle
                    </button>

                    {/* Sil Butonu */}
                    <button 
                      onClick={() => handleDelete(post.id)} 
                      className="text-red-600 hover:underline text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}