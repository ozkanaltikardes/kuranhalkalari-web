import { supabase } from "@/lib/supabase";
import Link from "next/link"; // Geri dön butonu için

// Bu fonksiyon sunucu tarafında çalışır ve veriyi çeker
async function getPost(slug: string, lang: string) {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("language", lang)
    .single();

  return data;
}

// Next.js 15 için Params tipini güncelledik (Promise)
export default async function PostDetail({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  // Parametreleri (URL'den gelen verileri) çözüyoruz
  const { slug, lang } = await params;
  
  // Veritabanından yazıyı çekiyoruz
  const post = await getPost(slug, lang);

  // Eğer yazı bulunamazsa (veya silinmişse)
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Aradığınız içerik bulunamadı.</p>
        <Link href={`/${lang}`} className="text-blue-600 hover:underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Kapak Resmi (Varsa) */}
      {post.image_url && (
        <div className="w-full h-[400px] relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Resim üzerine karartma efekti (yazı daha iyi görünsün diye opsiyonel) */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12 -mt-20 relative z-10">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          
          {/* Üst Bilgiler */}
          <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
             <Link href={`/${lang}`} className="text-blue-600 hover:underline font-medium">
               ← Geri Dön
             </Link>
             <time>{new Date(post.created_at).toLocaleDateString('tr-TR')}</time>
          </div>

          {/* Başlık */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          {/* İçerik */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

        </div>
      </div>
    </article>
  );
}