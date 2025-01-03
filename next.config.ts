import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true, // React Strict Mode'u etkinleştir
  images: {
    // Next.js'in resim optimizasyonunu kullanmak için `next/image` yapılandırması
    domains: ['example.com'], // İzin verilen dış alan adlarını buraya ekleyin
    // Diğer ayarları da ekleyebilirsiniz, örneğin:
    // deviceSizes: [320, 420, 768, 1024, 1200], // Cihaz boyutları için optimize edilmiş resimler
  },
  webpack(config, { isServer }) {
    // Webpack konfigürasyonu, sadece istek üzerine resimleri işlemek için
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg)$/i, // PNG, JPG, JPEG, GIF, SVG resimlerini hedef alır
      use: [
        {
          loader: 'url-loader', // Küçük resimleri base64'e dönüştürür
          options: {
            limit: 8192, // 8KB'ya kadar olan dosyalar base64'e dönüştürülür
            mimetype: 'image/png', // PNG resimlerini hedef alır
            // Resim dosyalarını bir klasöre kaydetmek için path belirtebilirsiniz
            // outputPath: 'static/images/',
          },
        },
      ],
    })

    // Server-side rendering işlemi yapılırken Webpack'in build edilmesini engellemek
    if (!isServer) {
      // Client-side'da Webpack işleme kısıtlamaları eklenebilir
    }

    return config
  },
}

export default nextConfig
