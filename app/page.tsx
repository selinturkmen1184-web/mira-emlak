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
  TR: { portfolio: "İlanlar", story: "RealYerin", services: "Hizmetler", membership: "Üyelik", reach: "Ücretsiz ilan ver", selected: "Önerilen ilan", explore: "İlanı incele", all: "Tüm ilanlar", filmLabel: "REALYERİN TANITIM FİLMİ", filmTitle: "Emlakta aradığınız her şey, gerçekten yerinde.", filmBody: "Doğrulanmış ilanları, güçlü aramayı ve güvenli iletişimi herkes için erişilebilir tek bir emlak platformunda buluşturuyoruz.", captions: "Altyazı", sign: "İşaret dili", signTitle: "İşaret dili penceresi / Demo", signBody: "Profesyonel tercüman videosu bu alanda eşzamanlı oynatılacaktır." },
  EN: { portfolio: "Listings", story: "RealYerin", services: "Services", membership: "Membership", reach: "Post free listing", selected: "Featured listing", explore: "View listing", all: "All listings", filmLabel: "THE REALYERİN FILM", filmTitle: "Everything you seek in real estate, exactly where it belongs.", filmBody: "Verified listings, powerful search and trusted communication in one accessible property platform.", captions: "Captions", sign: "Sign language", signTitle: "Sign-language window / Demo", signBody: "A professional interpreter video will play synchronously in this area." },
  DE: { portfolio: "Anzeigen", story: "RealYerin", services: "Leistungen", membership: "Mitgliedschaft", reach: "Kostenlos inserieren", selected: "Empfohlene Anzeige", explore: "Anzeige ansehen", all: "Alle Anzeigen", filmLabel: "DER REALYERİN FILM", filmTitle: "Alles rund um Immobilien, genau am richtigen Ort.", filmBody: "Geprüfte Anzeigen, starke Suche und sichere Kommunikation auf einer zugänglichen Immobilienplattform.", captions: "Untertitel", sign: "Gebärdensprache", signTitle: "Gebärdensprachfenster / Demo", signBody: "Hier wird synchron das Video einer professionellen Dolmetscherin abgespielt." },
  AR: { portfolio: "الإعلانات", story: "RealYerin", services: "الخدمات", membership: "العضوية", reach: "أضف إعلاناً مجاناً", selected: "إعلان مقترح", explore: "عرض الإعلان", all: "كل الإعلانات", filmLabel: "فيلم REALYERİN", filmTitle: "كل ما تبحث عنه في العقارات، في مكانه الصحيح.", filmBody: "إعلانات موثقة وبحث قوي وتواصل آمن في منصة عقارية واحدة متاحة للجميع.", captions: "الترجمة", sign: "لغة الإشارة", signTitle: "نافذة لغة الإشارة / نموذج", signBody: "سيُعرض فيديو مترجم محترف بلغة الإشارة هنا بشكل متزامن." },
};

const services = [
  ["01", "Doğrulanmış ilan", "Telefon ve ilan bilgisi kontrolleriyle daha güvenli bir arama deneyimi."],
  ["02", "Akıllı eşleştirme", "Konum, bütçe ve yaşam tercihlerine göre gerçekten ilgili sonuçlar."],
  ["03", "Doğrudan iletişim", "İlan sahibi veya profesyonel danışmanla hızlı ve şeffaf iletişim."],
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
    window.location.href = `mailto:merhaba@realyerin.com?subject=${encodeURIComponent(`Yeni RealYerin talebi — ${name}`)}&body=${encodeURIComponent(`Ad Soyad: ${name}\nTelefon: ${phone}\n\nTalep: ${note}`)}`;
  }

  return (
    <main className="mira-site market-v9" dir={language === "AR" ? "rtl" : "ltr"}>
      <header className="mira-header">
        <a className="mira-brand" href="#anasayfa" aria-label="RealYerin ana sayfa"><span className="mira-monogram">R<span>●</span></span><span className="mira-wordmark">REALYERİN<small>YERİNİ BUL. YERİNDE BUL.</small></span></a>
        <nav className={menuOpen ? "open" : ""} aria-label="Ana menü"><a href="#portfoy" onClick={() => { setIntent("Satılık"); setMenuOpen(false); }}>Satılık</a><a href="#portfoy" onClick={() => { setIntent("Kiralık"); setMenuOpen(false); }}>Kiralık</a><a href="#portfoy" onClick={() => setMenuOpen(false)}>Yeni projeler</a><a href="#tanitim" onClick={() => setMenuOpen(false)}>RealYerin'i tanı</a></nav>
        <div className="mira-header-actions"><label className="mira-language"><span className="sr-only">Dil seçin</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Dil seçin"><option>TR</option><option>EN</option><option>DE</option><option>AR</option></select></label><a className="mira-login" href="#uyelik">Giriş</a><a className="mira-contact-link" href="#uyelik">İlan ver<span>↗</span></a><button className="mira-menu" type="button" aria-label="Menüyü aç veya kapat" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "×" : "☰"}</button></div>
      </header>

      <section className="mira-hero" id="anasayfa">
        <div className="hero-photo" key={heroListing.id}><img src={heroListing.image} alt={heroListing.title} /><span /></div>
        <div className="hero-ghost" aria-hidden="true">YERİN</div>
        <div className="hero-frame" aria-hidden="true"><span>41° 02′ N / 29° 00′ E</span><span>SEÇKİ / 0{heroIndex + 1}</span></div>
        <div className="hero-copy">
          <p className="hero-kicker"><i /> REALYERİN SEÇKİSİ · 0{heroIndex + 1}</p>
          <span className="hero-location"><b>●</b> {heroListing.district} / {heroListing.city}</span>
          <h1>{heroListing.title}</h1>
          <p className="hero-summary">{heroListing.description}</p>
          <div className="hero-details"><span><b>{heroListing.rooms}</b><small>ODA</small></span><span><b>{heroListing.area}</b><small>BRÜT ALAN</small></span><span><b>{heroListing.floor}</b><small>KONUM</small></span></div>
          <div className="hero-price"><span>Satış değeri</span><strong>{heroListing.price}</strong><small><i /> Kimliği ve konumu doğrulandı</small></div>
          <div className="hero-links"><button type="button" onClick={() => setSelected(heroListing)}>Bu yeri keşfet<span>↗</span></button><a href="#portfoy">Tüm seçki <span>↓</span></a></div>
        </div>
        <aside className="hero-proof"><span>RY</span><strong>DOĞRULANDI</strong><small>İlan no. RY-{String(heroListing.id).padStart(5, "0")}</small></aside>
        <div className="hero-selector" aria-label="Önerilen ilanlar">{heroListings.map((home, index) => <button type="button" className={heroIndex === index ? "active" : ""} key={home.id} onClick={() => setHeroIndex(index)} aria-label={`${home.title} ilanını göster`}><span>0{index + 1}</span><img src={home.image} alt="" /><small><b>{home.district}</b>{home.kind}</small></button>)}</div>
        <form className="mira-search" onSubmit={submitSearch}><div className="search-title"><span>YERİNİ BUL</span><small>24.800+ doğrulanmış ilan</small></div><div className="mira-search-tabs" role="group" aria-label="İlan türü">{(["Satılık", "Kiralık"] as const).map((item) => <button type="button" className={intent === item ? "active" : ""} onClick={() => setIntent(item)} key={item}>{item}</button>)}</div><label><span>Konum</span><select value={city} onChange={(event) => setCity(event.target.value)}><option value="Tümü">Tüm Türkiye</option><option>İstanbul</option><option>İzmir</option><option>Ankara</option><option>Bursa</option></select></label><label><span>Mülk türü</span><select value={kind} onChange={(event) => setKind(event.target.value)}><option>Tümü</option><option>Konut</option><option>Villa</option><option>Arsa</option><option>İş yeri</option></select></label><button className="mira-search-button" type="submit"><span>{filteredListings.length} eşleşme hazır</span><b>Göster <i>↗</i></b></button></form>
      </section>

      <section className="ry-trust" aria-label="RealYerin platform bilgileri">
        <p><i /> Şu an 326 kişi RealYerin'de yeni bir yer arıyor</p>
        <div><span><strong>24.800+</strong><small>DOĞRULANMIŞ İLAN</small></span><span><strong>81</strong><small>ŞEHİRDE ERİŞİM</small></span><span><strong>4,9/5</strong><small>ARAMA DENEYİMİ</small></span><span><strong>12 ay</strong><small>ÜCRETSİZ ÜYELİK</small></span></div>
      </section>

      <section className="ry-categories" aria-label="Emlak kategorileri">
        <header><span className="section-kicker">01 / HIZLI KEŞİF</span><h2>Aradığın yer,<br /><em>bir seçim kadar yakın.</em></h2><p>Konut, villa, arsa veya iş yeri. Türkiye'nin her yerindeki güncel ilanlara tek noktadan ulaş.</p></header>
        <div className="ry-category-grid">
          {[["Konut", "18.240 ilan", listings[0].image], ["Villa", "3.180 ilan", listings[1].image], ["Arsa", "2.760 ilan", listings[5].image], ["İş yeri", "1.940 ilan", listings[3].image]].map(([title, count, image], index) => <button type="button" key={title} onClick={() => { setKind(title); document.getElementById("portfoy")?.scrollIntoView({ behavior: "smooth" }); }}><img src={image} alt="" loading="lazy" /><b>0{index + 1}</b><span>{title}</span><small>{count}</small><i>KEŞFET ↗</i></button>)}
        </div>
      </section>

      <section className="ry-listings" id="portfoy">
        <header className="ry-section-head"><div><span className="section-kicker">02 / SANA GÖRE SEÇTİK</span><h2>Yeni, doğrulanmış<br /><em>ve dikkat çeken ilanlar.</em></h2></div><div className="ry-filter">{(["Satılık", "Kiralık"] as const).map((item) => <button type="button" className={intent === item ? "active" : ""} onClick={() => setIntent(item)} key={item}>{item}</button>)}<button type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Tümü</button></div></header>
        {filteredListings.length ? <div className="ry-listing-grid">{filteredListings.map((home, index) => <article className={index === 0 ? "ry-card featured" : "ry-card"} key={home.id}><div className="ry-card-image"><img src={home.image} alt={home.title} loading="lazy" /><span className="ry-card-badge">{index === 0 ? "HAFTANIN İLANI" : home.intent.toUpperCase()}</span><button type="button" className={favorites.includes(home.id) ? "ry-fav saved" : "ry-fav"} aria-label={`${home.title} favori`} onClick={() => setFavorites((items) => items.includes(home.id) ? items.filter((id) => id !== home.id) : [...items, home.id])}>{favorites.includes(home.id) ? "♥" : "♡"}</button><small>RY-{String(home.id).padStart(5, "0")}</small></div><div className="ry-card-copy"><span>{home.district}, {home.city}</span><h3>{home.title}</h3><ul><li>{home.rooms}</li><li>{home.area}</li><li>{home.floor}</li></ul><footer><strong>{home.price}</strong><button type="button" onClick={() => setSelected(home)}>Detaylar →</button></footer></div></article>)}</div> : <div className="mira-empty"><h3>Bu seçimlere uygun ilan bulunamadı.</h3><button type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Tüm ilanları göster</button></div>}
      </section>

      <section className="ry-map" id="bolgeler">
        <div className="ry-map-canvas" aria-hidden="true"><div className="map-coast coast-one" /><div className="map-coast coast-two" /><div className="map-road road-one" /><div className="map-road road-two" /><span className="map-pin pin-one"><i>18.240</i></span><span className="map-pin pin-two"><i>3.180</i></span><span className="map-pin pin-three"><i>2.760</i></span><b>REALYERİN<br />CANLI BÖLGE HARİTASI</b><small>41.0082° N<br />28.9784° E</small></div>
        <div className="ry-map-copy"><span className="section-kicker">03 / BÖLGEYİ HİSSET</span><h2>Evden önce<br /><em>çevresini keşfet.</em></h2><p>İlanlara yalnızca oda sayısıyla değil; yaşam ritmi, ulaşım, sahile yakınlık ve yatırım hareketiyle bak.</p><div className="ry-city-list">{[["İstanbul", "18.240 ilan", "+%12"], ["İzmir", "4.620 ilan", "+%18"], ["Ankara", "3.980 ilan", "+%09"]].map(([name, count, trend], index) => <button type="button" key={name} onClick={() => { setCity(name); document.getElementById("portfoy")?.scrollIntoView({ behavior: "smooth" }); }}><span>0{index + 1}</span><strong>{name}<small>{count}</small></strong><b>{trend}<small>SON 30 GÜN</small></b><i>↗</i></button>)}</div></div>
      </section>

      <section className="ry-confidence" id="hizmetler">
        <div className="ry-confidence-copy"><span className="section-kicker">04 / NEDEN REALYERİN?</span><h2>İlan çok olabilir.<br /><em>Güven bir tanedir.</em></h2><p>Sahte ilanı, eksik bilgiyi ve zaman kaybını azaltmak için ilanları yayın öncesinde kontrol ediyor; arayanla ilan vereni doğrudan buluşturuyoruz.</p><a href="#uyelik">Platformu keşfet <span>↗</span></a></div>
        <div className="ry-confidence-list">{services.map(([number, title, description]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><b>✓</b></article>)}</div>
      </section>

      <section className="mira-film ry-film" id="tanitim"><div className="film-heading"><span className="section-kicker">05 / {copy.filmLabel}</span><h2>{copy.filmTitle}</h2><p>{copy.filmBody}</p><div className="film-index"><span>01</span><i /><small>00:11</small></div></div><div className="film-stage"><video controls playsInline preload="metadata" poster={listings[0].image} aria-label="RealYerin sinematik tanıtım filmi"><source src={`${assetBase}/mira-cinematic.mp4`} type="video/mp4" /><track kind="captions" src={`${assetBase}/subtitles/mira-tr.vtt`} srcLang="tr" label="Türkçe" default /><track kind="captions" src={`${assetBase}/subtitles/mira-en.vtt`} srcLang="en" label="English" /><track kind="captions" src={`${assetBase}/subtitles/mira-de.vtt`} srcLang="de" label="Deutsch" /><track kind="captions" src={`${assetBase}/subtitles/mira-ar.vtt`} srcLang="ar" label="العربية" /></video><span className="film-stamp">REALYERİN / ORİJİNAL</span>{signLanguage && <aside className="mira-sign" aria-label={copy.signTitle}><div className="sign-figure" aria-hidden="true"><span /><i /></div><strong>{copy.signTitle}</strong><p>{copy.signBody}</p></aside>}<div className="film-controls"><label>{copy.captions}<select value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option>TR</option><option>EN</option><option>DE</option><option>AR</option></select></label><button type="button" className={signLanguage ? "active" : ""} onClick={() => setSignLanguage((value) => !value)}>{copy.sign}<b>{signLanguage ? "AÇIK" : "KAPALI"}</b></button></div></div></section>

      <section className="ry-membership" id="uyelik">
        <header><span className="section-kicker">06 / REALYERİN ÜYELİK</span><h2>İlk yıl herkes için<br /><em>tamamen ücretsiz.</em></h2><p>İster evini arıyor ol, ister ilan veriyor, ister portföy yönetiyor ol. Sana uygun kanal hazır.</p></header>
        <div className="ry-plans">{[["01", "Bireysel", "Favoriler, kayıtlı aramalar ve yeni ilan bildirimleri", "Ücretsiz"], ["02", "İlan sahibi", "İlan yayınlama, mesaj yönetimi ve performans özeti", "Ücretsiz"], ["03", "Profesyonel", "Kurumsal vitrin, portföy yönetimi ve ekip araçları", "Ücretsiz"]].map(([number, title, description, price]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{description}</p><div><strong>{price}</strong><small>/ ilk 12 ay</small></div><a href="#iletisim">Ön kayıt oluştur <b>↗</b></a></article>)}</div>
      </section>

      <section className="ry-owner" id="iletisim">
        <div><span className="section-kicker">07 / SENİN YERİN</span><h2>Bir mülkün mü var?<br /><em>Doğru kişiye göster.</em></h2><p>Bilgilerini bırak; RealYerin ekibi ilanını hazırlamak veya aradığın mülkü bulmak için seninle iletişime geçsin.</p><a href="tel:+905550000000">+90 555 000 00 00</a><a href="mailto:merhaba@realyerin.com">merhaba@realyerin.com</a></div>
        <form className="ry-owner-form" onSubmit={submitContact}><div><label><span>Adınız soyadınız</span><input name="name" type="text" placeholder="Ad Soyad" required /></label><label><span>Telefon</span><input name="phone" type="tel" placeholder="05__ ___ __ __" required /></label></div><label><span>Talebiniz</span><textarea name="note" rows={4} placeholder="İlan vermek veya bir mülk bulmak istiyorum..." required /></label><button type="submit">Beni arayın <span>→</span></button>{contactSent && <p role="status">E-posta uygulamanız açılıyor. Mesajı göndererek talebinizi tamamlayabilirsiniz.</p>}</form>
      </section>

      <footer className="ry-footer"><div className="ry-footer-top"><a className="mira-brand footer" href="#anasayfa"><span className="mira-monogram">R</span><span className="mira-wordmark">REALYERİN<small>TÜRKİYE'NİN EMLAK PLATFORMU</small></span></a><p>Aradığın yer.<br /><b>Gerçekten yerinde.</b></p></div><div className="ry-footer-links"><span>© 2026 RealYerin. Tüm hakları saklıdır.</span><nav><a href="#portfoy">Satılık</a><a href="#portfoy">Kiralık</a><a href="#uyelik">Üyelik</a><a href="#iletisim">İletişim</a></nav></div></footer>

      {selected && <div className="mira-modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="mira-modal" role="dialog" aria-modal="true" aria-labelledby="mira-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" aria-label="Kapat" onClick={() => setSelected(null)}>×</button><div className="modal-image"><img src={selected.image} alt={selected.title} /><span>{selected.intent}</span></div><div className="modal-content"><small>{selected.district} / {selected.city}</small><h2 id="mira-modal-title">{selected.title}</h2><p>{selected.description}</p><ul><li><span>Oda</span><strong>{selected.rooms}</strong></li><li><span>Alan</span><strong>{selected.area}</strong></li><li><span>Detay</span><strong>{selected.floor}</strong></li></ul><footer><strong>{selected.price}</strong><a href="#iletisim" onClick={() => setSelected(null)}>Bilgi alın ↗</a></footer></div></section></div>}
    </main>
  );
}
