# Mira Emlak

Modern ve mobil uyumlu emlak portföy sitesi. Satılık/kiralık filtreleme, konum ve gayrimenkul tipi seçimi, favoriler, ilan detay penceresi, müşteri deneyimleri ve iletişim akışı içerir.

## Yerel çalıştırma

Node.js 22.13 veya üzeri gerekir.

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

## Yayına hazırlık

```bash
npm run build
npm test
```

## Müşteriye teslim etmeden önce

Aşağıdaki örnek bilgileri müşterinin gerçek bilgileriyle değiştirin:

- `Mira Emlak` marka adı
- `+90 555 000 00 00` telefon numarası
- `danisman@miraemlak.com` e-posta adresi
- örnek ilanlar, fiyatlar ve görseller
- deneyim, müşteri ve aktif portföy sayıları

İletişim formu, ziyaretçinin varsayılan e-posta uygulamasında hazırlanmış bir mesaj açar. Gerçek CRM veya form servisi bağlanacaksa `app/page.tsx` içindeki `submitContact` fonksiyonu güncellenebilir.

## Teknoloji

- React 19
- TypeScript
- vinext / Vite
- Cloudflare uyumlu Sites çıktısı
