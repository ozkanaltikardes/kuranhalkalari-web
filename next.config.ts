/** @type {import('next').NextConfig} */
const nextConfig = {
  // Yönlendirme Ayarı
  async redirects() {
    return [
      {
        source: '/',      // Kaynak: Ana sayfa
        destination: '/tr', // Hedef: Türkçe ana sayfa
        permanent: true,    // Bu kalıcı bir yönlendirmedir (308)
      },
    ];
  },
};

export default nextConfig;