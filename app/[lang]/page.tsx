import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Bu fonksiyon veritabanından yazıları çeker
async function getYazilar(dil: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('language', dil)      // Sadece seçilen dildeki yazıları getir
    .eq('is_published', true); // Sadece yayında olanları getir

  if (error) {
    console.error("Hata oluştu:", error);
    return [];
  }
  return data;
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  // 1. Dili öğren
  const { lang } = await params;

  // 2. O dile uygun yazıları çek
  const yazilar = await getYazilar(lang);

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Başlık */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Kuran Halkaları</h1>
          <p className="text-gray-600">
            Şu anki Dil: <span className="font-bold uppercase text-blue-600">{lang}</span>
          </p>
        </header>

        {/* Yazı Listesi (Grid Yapısı) */}
        <div className="grid gap-6 md:grid-cols-2">
          {yazilar?.map((yazi) => (
            <article key={yazi.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Resim Alanı */}
              {yazi.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={yazi.image_url} 
                    alt={yazi.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              
              {/* İçerik Alanı */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{yazi.title}</h2>
                <p className="text-gray-600 line-clamp-3 mb-4">{yazi.content}</p>
                <Link 
  href={`/${lang}/${yazi.slug}`} 
  className="text-blue-600 font-semibold hover:text-blue-800 text-sm"
>
  DEVAMINI OKU →
</Link>
              </div>
            </article>
          ))}
        </div>

        {/* Eğer hiç yazı yoksa */}
        {yazilar?.length === 0 && (
          <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-dashed border-gray-300">
            Bu dilde henüz içerik eklenmemiş.
          </div>
        )}

      </div>
    </main>
  );
}