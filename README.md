# Botfusions NaNo Prompt Galerisi

[Nano Banana Pro Prompts](https://youmind.com/tr-TR/nano-banana-pro-prompts) sayfasının modern replikası. Neo-Brutalist tasarım ve Next.js 15+ ile geliştirildi.

![Status](https://img.shields.io/badge/Prompts-87-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15+-black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🔍 **Gerçek Zamanlı Arama** | Başlık, içerik ve yazar bazlı filtreleme |
| ❤️ **Favoriler** | LocalStorage ile kalıcı favori listesi |
| 🏷️ **Kategori Filtreleme** | Profil/Avatar, Poster, Sosyal Medya vb. |
| 🎨 **Neo-Brutalist UI** | Keskin kenarlar, kalın gölgeler, canlı renkler |
| 📋 **Tek Tıkla Kopyala** | Prompt'u anında panoya kopyala |
| ⭐ **Öne Çıkan Etiketleri** | Featured prompt'lar için görsel işaretleme |

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Tarayıcıda aç
http://localhost:3000
```

## 📁 Proje Yapısı

```
botfusions-banana/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Ana sayfa
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global stiller
├── components/            # UI Bileşenleri
│   ├── Header.tsx         # Üst banner
│   ├── PromptCard.tsx     # Prompt kartı
│   ├── PromptGrid.tsx     # Kart grid'i
│   ├── SearchBar.tsx      # Arama çubuğu
│   └── CategoryFilter.tsx # Kategori filtreleri
├── src/data/
│   └── prompts.ts         # 87 prompt verisi
└── scripts/
    └── extract-prompts.js # Veri çıkarma scripti
```

## 🛠️ Teknik Stack

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS + CSS Variables
- **Icons:** Lucide React
- **Veri:** Cheerio ile HTML parsing
- **Storage:** LocalStorage (favoriler için)

## 📊 Mevcut Durum

- ✅ **87 prompt** başarıyla çıkarıldı ve entegre edildi
- ✅ YouMind ile birebir UI replikasyonu
- ✅ Arama, filtreleme ve favoriler tam fonksiyonel
- ⏳ Hedef: 1960+ prompt (YouMind API erişimi gerekiyor)

## 🔧 Veri Çıkarma

```bash
# BotNANo.txt'den prompt çıkar
node scripts/extract-prompts.js
```

## 📝 Lisans

MIT License - Bu proje eğitim amaçlıdır.
