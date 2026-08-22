"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Listing = {
  id: number;
  title: string;
  city: string;
  district: string;
  price: string;
  intent: "Satılık" | "Kiralık";
  kind: "Konut" | "Villa" | "Arsa" | "İş yeri";
  rooms: string;
  area: string;
  floor: string;
  image: string;
  featured?: boolean;
  description: string;
};

const listings: Listing[] = [
  { id: 1, title: "Boğaz manzaralı, teraslı daire", city: "İstanbul", district: "Beşiktaş", price: "18.750.000 TL", intent: "Satılık", kind: "Konut", rooms: "3+1", area: "165 m²", floor: "7. kat", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90", featured: true, description: "Boğaz hattına hâkim terası, aydınlık salonu ve yenilenmiş iç mimarisiyle taşınmaya hazır seçkin bir yaşam alanı." },
  { id: 2, title: "Marinaya yakın müstakil villa", city: "İzmir", district: "Urla", price: "24.900.000 TL", intent: "Satılık", kind: "Villa", rooms: "4+1", area: "280 m²", floor: "2 kat", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=90", featured: true, description: "Özel bahçesi, ferah yaşam alanları ve marinaya yakın konumuyla dört mevsim huzurlu bir yaşam sunan müstakil villa." },
  { id: 3, title: "Yatırımlık modern rezidans", city: "Bursa", district: "Nilüfer", price: "7.450.000 TL", intent: "Satılık", kind: "Konut", rooms: "2+1", area: "110 m²", floor: "10. kat", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90", description: "Ulaşım akslarına yakın, sosyal donatıları güçlü ve yüksek kira getirisi potansiyeli taşıyan modern rezidans dairesi." },
  { id: 4, title: "Cadde üzerinde prestijli ofis", city: "İstanbul", district: "Kadıköy", price: "95.000 TL / ay", intent: "Kiralık", kind: "İş yeri", rooms: "5 bölüm", area: "190 m²", floor: "3. kat", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1800&q=90", description: "Kurumsal kullanıma uygun planı, güçlü yaya trafiği ve toplu ulaşıma yakınlığıyla markanız için doğru adres." },
  { id: 5, title: "Bahçeli aile evi", city: "Ankara", district: "Çankaya", price: "42.000 TL / ay", intent: "Kiralık", kind: "Villa", rooms: "4+1", area: "220 m²", floor: "2 kat", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=90", featured: true, description: "Sessiz bir sokakta, geniş bahçesi ve kullanışlı oda dağılımıyla aile yaşamı için özenle seçilmiş kiralık ev." },
  { id: 6, title: "Gelişen bölgede imarlı arsa", city: "İzmir", district: "Seferihisar", price: "9.800.000 TL", intent: "Satılık", kind: "Arsa", rooms: "Konut imarlı", area: "1.240 m²", floor: "%30 emsal", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=90", description: "Gelişim aksında, yola cepheli ve altyapıya yakın konumuyla orta ve uzun vadeli yatırım için güçlü fırsat." },
];

type Language = "TR" | "EN" | "DE" | "AR";

const translations: Record<Language, { portfolio: string; story: string; services: string; membership: string; reach: string; selected: string; explore: string; all: string; filmLabel: string; filmTitle: string; filmBody: string; captions: string; sign: string; signTitle: string; signBody: string; }> = {
  TR: { portfolio: "Portföy", story: "MIRA", services: "Hizmetler", membership: "Üyelik", reach: "Danışmana ulaş", selected: "MIRA seçkisi", explore: "İlanı keşfet", all: "Tüm portföy", filmLabel: "MIRA TANITIM FİLMİ", filmTitle: "Bir adres seçmiyoruz. Bir yaşamın yönünü belirliyoruz.", filmBody: "Yerel uzmanlığı, güçlü sunumu ve insan dokunuşunu tek bir seçkin deneyimde buluşturuyoruz.", captions: "Altyazı", sign: "İşaret dili", signTitle: "İşaret dili penceresi / Demo", signBody: "Profesyonel tercüman videosu bu alanda eşzamanlı oynatılacaktır." },
  EN: { portfolio: "Portfolio", story: "MIRA", services: "Services", membership: "Membership", reach: "Meet an advisor", selected: "MIRA selection", explore: "Discover property", all: "Full portfolio", filmLabel: "THE MIRA FILM", filmTitle: "We do not choose an address. We shape the direction of a life.", filmBody: "Local expertise, compelling presentation and human insight in one refined experience.", captions: "Captions", sign: "Sign language", signTitle: "Sign-language window / Demo", signBody: "A professional interpreter video will play synchronously in this area." },
  DE: { portfolio: "Portfolio", story: "MIRA", services: "Leistungen", membership: "Mitgliedschaft", reach: "Beratung anfragen", selected: "MIRA Auswahl", explore: "Immobilie entdecken", all: "Ganzes Portfolio", filmLabel: "DER MIRA FILM", filmTitle: "Wir wählen keine Adresse. Wir gestalten die Richtung eines Lebens.", filmBody: "Lokale Expertise, starke Präsentation und persönliche Beratung in einem besonderen Erlebnis.", captions: "Untertitel", sign: "Gebärdensprache", signTitle: "Gebärdensprachfenster / Demo", signBody: "Hier wird synchron das Video einer professionellen Dolmetscherin abgespielt." },
  AR: { portfolio: "العقارات", story: "MIRA", services: "الخدمات", membership: "العضوية", reach: "تواصل مع مستشار", selected: "مختارات MIRA", explore: "اكتشف العقار", all: "كل العقارات", filmLabel: "فيلم MIRA", filmTitle: "نحن لا نختار عنواناً فحسب، بل نرسم مسار حياة.", filmBody: "نجمع الخبرة المحلية والعرض القوي واللمسة الإنسانية في تجربة راقية واحدة.", captions: "الترجمة", sign: "لغة الإشارة", signTitle: "نافذة لغة الإشارة / نموذج", signBody: "سيُعرض فيديو مترجم محترف بلغة الإشارة هنا بشكل متزامن." },
};

const services = [
  ["01", "Seçici portföy", "Her ilanı değil; konumu, değeri ve hikâyesi güçlü mülkleri temsil ederiz."],
  ["02", "Doğru konumlandırma", "Bölge verisi, fiyat analizi ve güçlü sunumla mülkün gerçek değerini görünür kılarız."],
  ["03", "Tek elden süreç", "İlk görüşmeden tapu gününe kadar tüm adımları açık, sakin ve güvenli biçimde yönetiriz."],
];

export default function Home() {
  const [intent, setIntent] = useState<"Satılık" | "Kiralık">("Satılık");
  const [city, setCity] = useState("Tümü");
  const [kind, setKind] = useState("Tümü");
  const [heroIndex, setHeroIndex] = useState(0);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("TR");
  const [signLanguage, setSignLanguage] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const heroListings = listings.filter((item) => item.featured);
  const heroListing = heroListings[heroIndex];
  const copy = translations[language];
  const assetBase = typeof window !== "undefined" && window.location.pathname.startsWith("/mira-emlak") ? "/mira-emlak" : "";
  const filteredListings = useMemo(() => listings.filter((item) => item.intent === intent && (city === "Tümü" || item.city === city) && (kind === "Tümü" || item.kind === kind)), [intent, city, kind]);

  useEffect(() => {
    function closeModal(event: KeyboardEvent) { if (event.key === "Escape") setSelected(null); }
    window.addEventListener("keydown", closeModal);
    return () => window.removeEventListener("keydown", closeModal);
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("portfoy")?.scrollIntoView({ behavior: "smooth" });
  }

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const note = String(data.get("note") || "");
    setContactSent(true);
    window.location.href = `mailto:danisman@miraemlak.com?subject=${encodeURIComponent(`Yeni emlak talebi — ${name}`)}&body=${encodeURIComponent(`Ad Soyad: ${name}\nTelefon: ${phone}\n\nTalep: ${note}`)}`;
  }

  return (
    <main className="mira-site" dir={language === "AR" ? "rtl" : "ltr"}>
      <header className="mira-header">
        <a className="mira-brand" href="#anasayfa" aria-label="MIRA ana sayfa"><span className="mira-monogram">M</span><span className="mira-wordmark">MIRA<small>GAYRİMENKUL &amp; YATIRIM</small></span></a>
        <nav className={menuOpen ? "open" : ""} aria-label="Ana menü"><a href="#portfoy" onClick={() => setMenuOpen(false)}>{copy.portfolio}</a><a href="#mira" onClick={() => setMenuOpen(false)}>{copy.story}</a><a href="#hizmetler" onClick={() => setMenuOpen(false)}>{copy.services}</a><a href="#uyelik" onClick={() => setMenuOpen(false)}>{copy.membership}</a></nav>
        <div className="mira-header-actions"><label className="mira-language"><span className="sr-only">Dil seçin</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Dil seçin"><option>TR</option><option>EN</option><option>DE</option><option>AR</option></select></label><a className="mira-contact-link" href="#iletisim">{copy.reach}<span>↗</span></a><button className="mira-menu" type="button" aria-label="Menüyü aç veya kapat" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "×" : "☰"}</button></div>
      </header>

      <section className="mira-hero" id="anasayfa">
        <div className="hero-photo" key={heroListing.id}><img src={heroListing.image} alt={heroListing.title} /><span /></div>
        <div className="hero-frame" aria-hidden="true"><span>41° 02′ N</span><span>MIRA / SELECT</span><span>28° 58′ E</span></div>
        <div className="hero-copy"><p className="hero-kicker"><i /> {copy.selected} / 0{heroIndex + 1}</p><span className="hero-location">{heroListing.district}, {heroListing.city}</span><h1>{heroListing.title}</h1><div className="hero-details"><span><b>{heroListing.rooms}</b><small>ODA</small></span><span><b>{heroListing.area}</b><small>BRÜT ALAN</small></span><span><b>{heroListing.floor}</b><small>KONUM</small></span></div><div className="hero-links"><button type="button" onClick={() => setSelected(heroListing)}>{copy.explore}<span>↗</span></button><a href="#portfoy">{copy.all}</a></div></div>
        <aside className="hero-price"><span>Satış değeri</span><strong>{heroListing.price}</strong><small><i /> MIRA doğrulanmış portföy</small></aside>
        <div className="hero-selector" aria-label="Önerilen ilanlar">{heroListings.map((home, index) => <button type="button" className={heroIndex === index ? "active" : ""} key={home.id} onClick={() => setHeroIndex(index)} aria-label={`${home.title} ilanını göster`}><span>0{index + 1}</span><img src={home.image} alt="" /><small>{home.district}</small></button>)}</div>
        <form className="mira-search" onSubmit={submitSearch}><div className="mira-search-tabs" role="group" aria-label="İlan türü">{(["Satılık", "Kiralık"] as const).map((item) => <button type="button" className={intent === item ? "active" : ""} onClick={() => setIntent(item)} key={item}>{item}</button>)}</div><label><span>Şehir</span><select value={city} onChange={(event) => setCity(event.target.value)}><option>Tümü</option><option>İstanbul</option><option>İzmir</option><option>Ankara</option><option>Bursa</option></select></label><label><span>Gayrimenkul</span><select value={kind} onChange={(event) => setKind(event.target.value)}><option>Tümü</option><option>Konut</option><option>Villa</option><option>Arsa</option><option>İş yeri</option></select></label><button className="mira-search-button" type="submit"><span>{filteredListings.length} seçkin ilan</span><b>Keşfet ↗</b></button></form>
      </section>

      <section className="mira-intro" aria-label="MIRA yaklaşımı"><div className="intro-copy"><span className="section-kicker">MIRA / YAKLAŞIM</span><h2>Daha fazla ilan değil.<br /><em>Daha doğru seçim.</em></h2></div><p>Bir mülkü yalnız metrekaresiyle değil; ışığı, çevresi, yatırım gücü ve yaşam hissiyle birlikte değerlendiriyoruz.</p><div className="intro-stats"><span><strong>12+</strong><small>Yıllık deneyim</small></span><span><strong>%98</strong><small>Tavsiye oranı</small></span><span><strong>19</strong><small>Gün ort. sonuç</small></span></div></section>

      <section className="mira-portfolio" id="portfoy">
        <header className="portfolio-heading"><div><span className="section-kicker">01 / EDİTÖRÜN SEÇİMİ</span><h2>İçinize sinen<br /><em>bir yer mutlaka vardır.</em></h2></div><div className="portfolio-controls">{(["Satılık", "Kiralık"] as const).map((item) => <button type="button" className={intent === item ? "active" : ""} onClick={() => setIntent(item)} key={item}>{item}</button>)}<button type="button" className="clear-filter" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Tümü</button></div></header>
        {filteredListings.length ? <div className="mira-property-grid">{filteredListings.map((home, index) => <article className={index === 0 ? "mira-property-card feature" : "mira-property-card"} key={home.id}><div className="card-image"><img src={home.image} alt={home.title} loading="lazy" /><span className="card-number">0{index + 1}</span><span className="card-intent">{home.intent}</span><button type="button" className={favorites.includes(home.id) ? "card-favorite saved" : "card-favorite"} aria-label={`${home.title} favori`} onClick={() => setFavorites((items) => items.includes(home.id) ? items.filter((id) => id !== home.id) : [...items, home.id])}>{favorites.includes(home.id) ? "♥" : "♡"}</button></div><div className="card-copy"><div><span>{home.district} / {home.city}</span><h3>{home.title}</h3></div><p>{home.description}</p><ul><li>{home.rooms}</li><li>{home.area}</li><li>{home.floor}</li></ul><footer><strong>{home.price}</strong><button type="button" onClick={() => setSelected(home)}>İncele <span>↗</span></button></footer></div></article>)}</div> : <div className="mira-empty"><h3>Aradığınız ölçütlerde bir portföy bulunamadı.</h3><button type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Tüm portföyü göster</button></div>}
      </section>

      <section className="mira-film" id="mira"><div className="film-heading"><span className="section-kicker">02 / {copy.filmLabel}</span><h2>{copy.filmTitle}</h2><p>{copy.filmBody}</p><div className="film-index"><span>01</span><i /><small>00:11</small></div></div><div className="film-stage"><video controls playsInline preload="metadata" poster={listings[0].image} aria-label="MIRA sinematik tanıtım filmi"><source src={`${assetBase}/mira-cinematic.mp4`} type="video/mp4" /><track kind="captions" src={`${assetBase}/subtitles/mira-tr.vtt`} srcLang="tr" label="Türkçe" default /><track kind="captions" src={`${assetBase}/subtitles/mira-en.vtt`} srcLang="en" label="English" /><track kind="captions" src={`${assetBase}/subtitles/mira-de.vtt`} srcLang="de" label="Deutsch" /><track kind="captions" src={`${assetBase}/subtitles/mira-ar.vtt`} srcLang="ar" label="العربية" /></video><span className="film-stamp">A MIRA FILM</span>{signLanguage && <aside className="mira-sign" aria-label={copy.signTitle}><div className="sign-figure" aria-hidden="true"><span /><i /></div><strong>{copy.signTitle}</strong><p>{copy.signBody}</p></aside>}<div className="film-controls"><label>{copy.captions}<select value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option>TR</option><option>EN</option><option>DE</option><option>AR</option></select></label><button type="button" className={signLanguage ? "active" : ""} onClick={() => setSignLanguage((value) => !value)}>{copy.sign}<b>{signLanguage ? "AÇIK" : "KAPALI"}</b></button></div></div></section>

      <section className="mira-advisory" id="hizmetler"><div className="advisory-photo"><img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=90" alt="Gayrimenkul danışmanlığı görüşmesi" loading="lazy" /><div><strong>MIRA</strong><span>İyi bir danışmanlık, doğru soruyla başlar.</span></div></div><div className="advisory-content"><span className="section-kicker">03 / DANIŞMANLIK</span><h2>Mülkünüzü<br /><em>bir markaya dönüştürürüz.</em></h2><p className="advisory-lead">Gürültülü ilan kalabalığının yerine; ölçülü, güven veren ve doğru kişiye ulaşan bir sunum kurarız.</p><div className="service-list">{services.map(([number, title, description]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></div></section>

      <section className="mira-membership" id="uyelik"><div className="membership-number"><span>İLK YIL</span><strong>12</strong><small>AY ÜCRETSİZ</small></div><div className="membership-copy"><span className="section-kicker">04 / MIRA ÜYELİK</span><h2>Portföye daha erken,<br /><em>karara daha güvenli ulaşın.</em></h2><p>Favoriler, akıllı arama, yeni ilanlara erken erişim ve danışman iletişimi tek bir üyelikte. Bireysel, profesyonel ve kurumsal kanallar ilk 12 ay ücretsiz.</p><a href="#iletisim">Ön kayıt oluştur <span>↗</span></a></div></section>

      <section className="mira-contact" id="iletisim"><div className="contact-story"><span className="section-kicker">05 / TANIŞALIM</span><blockquote>“Doğru adres, insanın kendine verdiği en güzel sözlerden biridir.”</blockquote><div><strong>MIRA</strong><span>Gayrimenkul &amp; Yatırım</span></div><p>Kısa bir not bırakın. Size daha fazla seçenekle değil, daha net bir yönle dönelim.</p><a href="tel:+905550000000">+90 555 000 00 00</a><a href="mailto:danisman@miraemlak.com">danisman@miraemlak.com</a></div><form className="mira-contact-form" onSubmit={submitContact}><div><label><span>Adınız soyadınız</span><input name="name" type="text" placeholder="Ad Soyad" required /></label><label><span>Telefon</span><input name="phone" type="tel" placeholder="05__ ___ __ __" required /></label></div><label><span>Nasıl yardımcı olabiliriz?</span><textarea name="note" rows={4} placeholder="Satmak, kiralamak veya yeni bir mülk bulmak istiyorum..." required /></label><button type="submit">MIRA ile konuş <span>↗</span></button>{contactSent && <p role="status">E-posta uygulamanız açılıyor. Mesajı göndererek talebinizi tamamlayabilirsiniz.</p>}</form></section>

      <footer className="mira-footer"><div><a className="mira-brand footer" href="#anasayfa"><span className="mira-monogram">M</span><span className="mira-wordmark">MIRA<small>GAYRİMENKUL &amp; YATIRIM</small></span></a><p>Seçkin portföy.<br />Güvenli karar.</p></div><div><span>© 2026 MIRA. Tüm hakları saklıdır.</span><nav><a href="#portfoy">Portföy</a><a href="#hizmetler">Hizmetler</a><a href="#iletisim">İletişim</a></nav></div></footer>

      {selected && <div className="mira-modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="mira-modal" role="dialog" aria-modal="true" aria-labelledby="mira-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" aria-label="Kapat" onClick={() => setSelected(null)}>×</button><div className="modal-image"><img src={selected.image} alt={selected.title} /><span>{selected.intent}</span></div><div className="modal-content"><small>{selected.district} / {selected.city}</small><h2 id="mira-modal-title">{selected.title}</h2><p>{selected.description}</p><ul><li><span>Oda</span><strong>{selected.rooms}</strong></li><li><span>Alan</span><strong>{selected.area}</strong></li><li><span>Detay</span><strong>{selected.floor}</strong></li></ul><footer><strong>{selected.price}</strong><a href="#iletisim" onClick={() => setSelected(null)}>Bilgi alın ↗</a></footer></div></section></div>}
    </main>
  );
}
