"use client";

import { CSSProperties, FormEvent, useMemo, useState } from "react";

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
  {
    id: 1,
    title: "Boğaz manzaralı, teraslı daire",
    city: "İstanbul",
    district: "Beşiktaş",
    price: "18.750.000 TL",
    intent: "Satılık",
    kind: "Konut",
    rooms: "3+1",
    area: "165 m²",
    floor: "7. kat",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description: "Boğaz hattına hâkim terası, aydınlık salonu ve yenilenmiş iç mimarisiyle taşınmaya hazır seçkin bir yaşam alanı.",
  },
  {
    id: 2,
    title: "Marinaya yakın müstakil villa",
    city: "İzmir",
    district: "Urla",
    price: "24.900.000 TL",
    intent: "Satılık",
    kind: "Villa",
    rooms: "4+1",
    area: "280 m²",
    floor: "2 kat",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description: "Özel bahçesi, ferah yaşam alanları ve marinaya yakın konumuyla dört mevsim huzurlu bir yaşam sunan müstakil villa.",
  },
  {
    id: 3,
    title: "Yatırımlık modern rezidans",
    city: "Bursa",
    district: "Nilüfer",
    price: "7.450.000 TL",
    intent: "Satılık",
    kind: "Konut",
    rooms: "2+1",
    area: "110 m²",
    floor: "10. kat",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    description: "Ulaşım akslarına yakın, sosyal donatıları güçlü ve yüksek kira getirisi potansiyeli taşıyan modern rezidans dairesi.",
  },
  {
    id: 4,
    title: "Cadde üzerinde prestijli ofis",
    city: "İstanbul",
    district: "Kadıköy",
    price: "95.000 TL / ay",
    intent: "Kiralık",
    kind: "İş yeri",
    rooms: "5 bölüm",
    area: "190 m²",
    floor: "3. kat",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
    description: "Kurumsal kullanıma uygun planı, güçlü yaya trafiği ve toplu ulaşıma yakınlığıyla markanız için doğru adres.",
  },
  {
    id: 5,
    title: "Bahçeli aile evi",
    city: "Ankara",
    district: "Çankaya",
    price: "42.000 TL / ay",
    intent: "Kiralık",
    kind: "Villa",
    rooms: "4+1",
    area: "220 m²",
    floor: "2 kat",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description: "Sessiz bir sokakta, geniş bahçesi ve kullanışlı oda dağılımıyla aile yaşamı için özenle seçilmiş kiralık ev.",
  },
  {
    id: 6,
    title: "Gelişen bölgede imarlı arsa",
    city: "İzmir",
    district: "Seferihisar",
    price: "9.800.000 TL",
    intent: "Satılık",
    kind: "Arsa",
    rooms: "Konut imarlı",
    area: "1.240 m²",
    floor: "%30 emsal",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85",
    description: "Gelişim aksında, yola cepheli ve altyapıya yakın konumuyla orta ve uzun vadeli yatırım için güçlü fırsat.",
  },
];

const services = [
  ["01", "Portföy danışmanlığı", "İhtiyacınızı dinler, yalnızca size uyan seçenekleri sunarız."],
  ["02", "Doğru fiyat analizi", "Güncel bölge verileriyle mülkünüzün gerçek piyasa değerini belirleriz."],
  ["03", "Uçtan uca süreç", "İlan sunumundan tapu gününe kadar her adımı güvenle yönetiriz."],
];

const marketData = {
  İstanbul: { demand: 87, time: "19 gün", trend: "+%12.8", label: "Yüksek talep" },
  İzmir: { demand: 74, time: "24 gün", trend: "+%9.4", label: "Hızlanan bölge" },
  Ankara: { demand: 69, time: "27 gün", trend: "+%7.1", label: "Dengeli piyasa" },
  Bursa: { demand: 63, time: "31 gün", trend: "+%6.3", label: "Yükselen değer" },
};

type Language = "TR" | "EN" | "DE" | "AR";

const translations: Record<Language, {
  featured: string;
  intro: string;
  listings: string;
  membership: string;
  contact: string;
  start: string;
  portfolio: string;
  explore: string;
  salesValue: string;
  verified: string;
  filmEyebrow: string;
  filmTitle: string;
  filmBody: string;
  filmNote: string;
  subtitles: string;
  signLanguage: string;
  signDemo: string;
  signDemoBody: string;
}> = {
  TR: { featured: "Önerilen", intro: "MIRA’yı Tanı", listings: "Tüm İlanlar", membership: "Üyelik", contact: "İletişim", start: "Ücretsiz başla", portfolio: "Önerilen portföy", explore: "İlanı incele", salesValue: "Satış değeri", verified: "MIRA doğrulanmış portföy", filmEyebrow: "02 / MIRA TANITIM FİLMİ", filmTitle: "Bir emlak sitesi değil. Yeni nesil gayrimenkul ağı.", filmBody: "Portföyü, teknolojiyi ve insan dokunuşunu tek bir seçkin deneyimde buluşturuyoruz.", filmNote: "Sinematik tanıtım · 00:11", subtitles: "Altyazı", signLanguage: "İşaret dili", signDemo: "İşaret dili penceresi / Demo", signDemoBody: "Profesyonel tercüman videosu bu alanda eşzamanlı oynatılacaktır." },
  EN: { featured: "Featured", intro: "Discover MIRA", listings: "All Listings", membership: "Membership", contact: "Contact", start: "Start free", portfolio: "Featured portfolio", explore: "View property", salesValue: "Sale value", verified: "MIRA verified portfolio", filmEyebrow: "02 / THE MIRA FILM", filmTitle: "Not just a property site. A new-generation real estate network.", filmBody: "We bring portfolio, technology and human insight together in one refined experience.", filmNote: "Cinematic introduction · 00:11", subtitles: "Captions", signLanguage: "Sign language", signDemo: "Sign-language window / Demo", signDemoBody: "A professional interpreter video will play synchronously in this area." },
  DE: { featured: "Empfohlen", intro: "MIRA entdecken", listings: "Alle Immobilien", membership: "Mitgliedschaft", contact: "Kontakt", start: "Kostenlos starten", portfolio: "Empfohlenes Portfolio", explore: "Immobilie ansehen", salesValue: "Verkaufswert", verified: "Von MIRA geprüft", filmEyebrow: "02 / DER MIRA FILM", filmTitle: "Mehr als ein Immobilienportal. Ein Netzwerk der neuen Generation.", filmBody: "Wir verbinden Portfolio, Technologie und persönliche Beratung zu einem besonderen Erlebnis.", filmNote: "Cinematische Einführung · 00:11", subtitles: "Untertitel", signLanguage: "Gebärdensprache", signDemo: "Gebärdensprachfenster / Demo", signDemoBody: "Hier wird synchron das Video einer professionellen Dolmetscherin abgespielt." },
  AR: { featured: "مختاراتنا", intro: "اكتشف MIRA", listings: "كل العقارات", membership: "العضوية", contact: "تواصل", start: "ابدأ مجاناً", portfolio: "العقارات المقترحة", explore: "عرض العقار", salesValue: "قيمة البيع", verified: "عقار موثّق من MIRA", filmEyebrow: "02 / فيلم MIRA", filmTitle: "ليست مجرد منصة عقارية، بل شبكة عقارات من الجيل الجديد.", filmBody: "نجمع العقارات والتقنية والخبرة الإنسانية في تجربة راقية واحدة.", filmNote: "فيلم تعريفي · 00:11", subtitles: "الترجمة", signLanguage: "لغة الإشارة", signDemo: "نافذة لغة الإشارة / نموذج", signDemoBody: "سيُعرض فيديو مترجم محترف بلغة الإشارة هنا بشكل متزامن." },
};

export default function Home() {
  const [intent, setIntent] = useState<"Satılık" | "Kiralık">("Satılık");
  const [city, setCity] = useState("Tümü");
  const [kind, setKind] = useState("Tümü");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [language, setLanguage] = useState<Language>("TR");
  const [signLanguage, setSignLanguage] = useState(false);
  const [marketCity, setMarketCity] = useState<keyof typeof marketData>("İstanbul");

  const heroListings = listings.filter((item) => item.featured);
  const heroListing = heroListings[heroIndex];
  const copy = translations[language];
  const assetBase = typeof window !== "undefined" && window.location.pathname.startsWith("/mira-emlak") ? "/mira-emlak" : "";

  const filteredListings = useMemo(
    () => listings.filter((item) =>
      item.intent === intent &&
      (city === "Tümü" || item.city === city) &&
      (kind === "Tümü" || item.kind === kind)
    ),
    [intent, city, kind]
  );

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("ilanlar")?.scrollIntoView({ behavior: "smooth" });
  }

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const note = String(data.get("note") || "");
    const subject = encodeURIComponent(`Yeni emlak talebi — ${name}`);
    const body = encodeURIComponent(`Ad Soyad: ${name}\nTelefon: ${phone}\n\nTalep: ${note}`);
    setContactSent(true);
    window.location.href = `mailto:danisman@miraemlak.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="site-shell site-v5" dir={language === "AR" ? "rtl" : "ltr"}>
      <header className="site-header site-header-v4">
        <a className="brand" href="#anasayfa" aria-label="Mira Emlak ana sayfa">
          <span className="brand-mark"><i>M</i><b>/</b></span>
          <span>MIRA<small>Gayrimenkul &amp; Yatırım</small></span>
        </a>
        <nav className={menuOpen ? "open" : ""} aria-label="Ana menü">
          <a href="#anasayfa" onClick={() => setMenuOpen(false)}>{copy.featured}</a>
          <a href="#tanitim" onClick={() => setMenuOpen(false)}>{copy.intro}</a>
          <a href="#ilanlar" onClick={() => setMenuOpen(false)}>{copy.listings}</a>
          <a href="#uyelik" onClick={() => setMenuOpen(false)}>{copy.membership}</a>
          <a href="#iletisim" onClick={() => setMenuOpen(false)}>{copy.contact}</a>
        </nav>
        <div className="header-actions">
          <label className="language-switcher"><span className="sr-only">Dil seçin</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Dil seçin"><option>TR</option><option>EN</option><option>DE</option><option>AR</option></select></label>
          <a className="header-cta" href="#uyelik">{copy.start} <span>↗</span></a>
          <button className="menu-button" type="button" aria-label="Menüyü aç veya kapat" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button>
        </div>
      </header>

      <section className="showcase showcase-v5" id="anasayfa" onPointerMove={(event) => {
        const frame = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${((event.clientX - frame.left) / frame.width) * 100}%`);
        event.currentTarget.style.setProperty("--my", `${((event.clientY - frame.top) / frame.height) * 100}%`);
      }}>
        <div className="showcase-backdrop" key={heroListing.id}><img src={heroListing.image} alt="" /><span /></div>
        <div className="showcase-grid" aria-hidden="true" />
        <div className="showcase-word" aria-hidden="true">PORTFÖY</div>
        <div className="showcase-estate-badge"><span>Günün önerilen ilanı</span><strong>{heroListing.district} / {heroListing.city}</strong></div>
        <div className="showcase-copy">
          <span className="showcase-label"><i /> ÖNE ÇIKAN İLAN / 0{heroIndex + 1}</span>
          <p>{heroListing.district} · {heroListing.city}</p>
          <h1>{heroListing.title}</h1>
          <div className="showcase-facts"><span>{heroListing.rooms}<small>Oda</small></span><span>{heroListing.area}<small>Brüt alan</small></span><span>{heroListing.floor}<small>Konum</small></span></div>
          <div className="showcase-actions"><button type="button" onClick={() => setSelected(heroListing)}>{copy.explore} <span>↗</span></button><a href="#ilanlar">{copy.listings}</a></div>
        </div>
        <div className="showcase-price"><span>{copy.salesValue}</span><strong>{heroListing.price}</strong><small><i /> {copy.verified}</small></div>
        <div className="showcase-nav" aria-label="Önerilen ilanlar">
          {heroListings.map((home, index) => <button type="button" className={heroIndex === index ? "active" : ""} key={home.id} onClick={() => setHeroIndex(index)} aria-label={`${home.title} ilanını göster`}><img src={home.image} alt="" /><span>0{index + 1} · {home.kind}</span><strong>{home.district}</strong></button>)}
        </div>
        <div className="showcase-counter"><strong>0{heroIndex + 1}</strong><span>/ 0{heroListings.length}</span><i style={{ "--progress": `${((heroIndex + 1) / heroListings.length) * 100}%` } as CSSProperties} /></div>
        <div className="showcase-scroll" aria-hidden="true"><span>İLANLARI KEŞFET</span><i /></div>

        <form className="property-search property-search-v4" onSubmit={submitSearch}>
          <div className="search-tabs" role="group" aria-label="İlan türü">
            {(["Satılık", "Kiralık"] as const).map((item) => (
              <button className={intent === item ? "active" : ""} type="button" key={item} onClick={() => setIntent(item)}>{item}</button>
            ))}
          </div>
          <label>
            <span>Konum</span>
            <select value={city} onChange={(event) => setCity(event.target.value)}>
              <option>Tümü</option><option>İstanbul</option><option>İzmir</option><option>Ankara</option><option>Bursa</option>
            </select>
          </label>
          <label>
            <span>Gayrimenkul tipi</span>
            <select value={kind} onChange={(event) => setKind(event.target.value)}>
              <option>Tümü</option><option>Konut</option><option>Villa</option><option>Arsa</option><option>İş yeri</option>
            </select>
          </label>
          <button className="search-button" type="submit">{filteredListings.length} ilanı keşfet <span>↗</span></button>
        </form>
      </section>

      <div className="editorial-ticker" aria-hidden="true">
        <div><span>SEÇKİN PORTFÖY</span><b>◆</b><span>GÜVENLİ DANIŞMANLIK</span><b>◆</b><span>DOĞRU YATIRIM</span><b>◆</b><span>YENİ NESİL GAYRİMENKUL</span><b>◆</b><span>SEÇKİN PORTFÖY</span><b>◆</b></div>
      </div>

      <section className="signal-board" aria-label="MIRA bölge analiz ekranı">
        <div className="signal-heading">
          <span>02 / BÖLGE ANALİZİ</span>
          <h2>Bölgeyi okuyun.<br /><em>Doğru yatırımı seçin.</em></h2>
          <p>Talep yoğunluğunu, satış hızını ve değer değişimini sade verilerle okuyarak güvenli yatırım kararını görünür kılıyoruz.</p>
        </div>
        <div className="signal-console">
          <div className="signal-map" aria-hidden="true">
            <div className="signal-radar"><i /><i /><i /><i /></div>
            <span className="map-point p1" /><span className="map-point p2" /><span className="map-point p3" /><span className="map-point p4" /><span className="map-point p5" />
            <b>BÖLGE<br />DEĞER<br />HARİTASI</b>
            <small>MIRA<br />ANALİZ MERKEZİ</small>
          </div>
          <div className="signal-data">
            <div className="signal-tabs" role="group" aria-label="Bölge seçimi">
              {(Object.keys(marketData) as Array<keyof typeof marketData>).map((item) => <button type="button" className={marketCity === item ? "active" : ""} key={item} onClick={() => setMarketCity(item)}><span>{item}</span><small>{marketData[item].label}</small></button>)}
            </div>
            <div className="signal-metrics">
              <article><small>TALEP ENDEKSİ</small><strong>{marketData[marketCity].demand}<sup>/100</sup></strong><i style={{ "--metric": `${marketData[marketCity].demand}%` } as CSSProperties} /></article>
              <article><small>ORT. SONUÇLANMA</small><strong>{marketData[marketCity].time}</strong><span>Son 90 gün</span></article>
              <article><small>DEĞER DEĞİŞİMİ</small><strong>{marketData[marketCity].trend}</strong><span>Yıllık projeksiyon ↗</span></article>
            </div>
          </div>
        </div>
      </section>

      <section className="cinematic" id="tanitim">
        <div className="cinematic-heading">
          <span>03 / MIRA HİKÂYESİ</span>
          <h2>{copy.filmTitle}</h2>
          <p>{copy.filmBody}</p>
        </div>
        <div className="cinematic-stage">
          <video controls playsInline preload="metadata" poster={listings[0].image} aria-label="MIRA sinematik tanıtım filmi">
            <source src={`${assetBase}/mira-cinematic.mp4`} type="video/mp4" />
            <track kind="captions" src={`${assetBase}/subtitles/mira-tr.vtt`} srcLang="tr" label="Türkçe" default />
            <track kind="captions" src={`${assetBase}/subtitles/mira-en.vtt`} srcLang="en" label="English" />
            <track kind="captions" src={`${assetBase}/subtitles/mira-de.vtt`} srcLang="de" label="Deutsch" />
            <track kind="captions" src={`${assetBase}/subtitles/mira-ar.vtt`} srcLang="ar" label="العربية" />
          </video>
          <div className="cinematic-watermark" aria-hidden="true">MIRA / 01</div>
          {signLanguage && (
            <aside className="sign-language-frame" aria-label={copy.signDemo}>
              <div className="sign-language-avatar" aria-hidden="true"><span /><i /></div>
              <strong>{copy.signDemo}</strong>
              <p>{copy.signDemoBody}</p>
            </aside>
          )}
        </div>
        <div className="accessibility-bar">
          <span>{copy.filmNote}</span>
          <div>
            <label>{copy.subtitles}<select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={copy.subtitles}><option>TR</option><option>EN</option><option>DE</option><option>AR</option></select></label>
            <button type="button" className={signLanguage ? "active" : ""} aria-pressed={signLanguage} onClick={() => setSignLanguage((current) => !current)}>{copy.signLanguage} <span>{signLanguage ? "ON" : "OFF"}</span></button>
          </div>
        </div>
      </section>

      <section className="category-strip" aria-label="Gayrimenkul kategorileri">
        <div className="category-intro"><span>04 / Seçim alanı</span><h2>Aradığınız mülkü<br /><em>tek bakışta bulun.</em></h2><p>Konut, villa, arsa veya iş yeri. Doğrulanmış portföyü ihtiyacınıza göre daraltın.</p></div>
        <div>
          {["Konut", "Villa", "Arsa", "İş yeri"].map((item, index) => (
            <button key={item} type="button" onClick={() => { setKind(item); document.getElementById("ilanlar")?.scrollIntoView({ behavior: "smooth" }); }}>
              <i>0{index + 1}</i><span>{item}</span><small>SEÇ ↗</small>
            </button>
          ))}
        </div>
      </section>

      <section className="featured" id="ilanlar">
        <div className="section-heading">
          <div><span className="eyebrow">05 / SEÇKİN PORTFÖY</span><h2>Sizin için<br /><em>öne çıkanlar.</em></h2></div>
          <p>{String(filteredListings.length).padStart(2, "0")} mekân yayında</p>
        </div>
        <div className="listing-filter" aria-label="Hızlı ilan filtresi">
          <div>
            {(["Satılık", "Kiralık"] as const).map((item) => <button key={item} className={intent === item ? "active" : ""} type="button" onClick={() => setIntent(item)}>{item}</button>)}
          </div>
          <button className={city === "Tümü" && kind === "Tümü" ? "reset hidden" : "reset"} type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Filtreleri temizle ×</button>
        </div>

        {filteredListings.length > 0 ? (
          <div className="property-grid">
            {filteredListings.map((home, index) => (
              <article className="property-card" key={home.id}>
                <span className="property-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="property-image-wrap">
                  <img src={home.image} alt={home.title} loading="lazy" />
                  <span className="property-badge">{home.intent}</span>
                  {home.featured && <span className="featured-badge">MIRA PICK</span>}
                  <button className={favorites.includes(home.id) ? "favorite saved" : "favorite"} type="button" aria-label={`${home.title} ilanını favorilere ${favorites.includes(home.id) ? "çıkar" : "ekle"}`} onClick={() => toggleFavorite(home.id)}>{favorites.includes(home.id) ? "♥" : "♡"}</button>
                </div>
                <div className="property-body">
                  <span>{home.district} / {home.city}</span>
                  <h3>{home.title}</h3>
                  <p>{home.description}</p>
                  <ul aria-label="İlan özellikleri"><li>{home.rooms}</li><li>{home.area}</li><li>{home.floor}</li></ul>
                  <div><strong>{home.price}</strong><button type="button" onClick={() => setSelected(home)}>Mekânı keşfet ↗</button></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><span>⌕</span><h3>Bu filtrelere uygun ilan bulunamadı.</h3><p>Filtreleri temizleyerek diğer portföylere göz atabilirsiniz.</p><button type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Tüm ilanları göster</button></div>
        )}
      </section>

      <section className="value-band">
        <span className="value-number">06</span>
        <p>Satmak / kiralamak / yeniden konumlandırmak</p>
        <h2>Mülkünüzü<br /><em>markaya dönüştürün.</em></h2>
        <div><p>Her mülkün anlatılacak bir karakteri vardır. Biz onu sıradan ilan kalabalığından çıkarır, doğru alıcının karşısına bir marka gibi koyarız.</p><a href="#iletisim">Mülkünüzü MIRA’ya alın <span>↗</span></a></div>
      </section>

      <section className="services" id="hizmetler">
        <div className="services-intro">
          <span className="eyebrow">07 / ÇALIŞMA BİÇİMİ</span>
          <h2>Az konuşur,<br /><em>iyi seçeriz.</em></h2>
          <p>Bir algoritma gibi hızlı, iyi bir editör gibi seçiciyiz. Gürültüyü eler, kararı kolaylaştırırız.</p>
        </div>
        <div className="services-list">
          {services.map(([number, title, description]) => (
            <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><b>↗</b></article>
          ))}
        </div>
      </section>

      <section className="about" id="hakkimizda">
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85" alt="Müşterisiyle gayrimenkul danışmanlığı görüşmesi yapan uzman" loading="lazy" />
          <div><strong>%98</strong><span>Tavsiye edilme oranı</span></div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">08 / MIRA MANİFESTO</span>
          <h2>Bir evin değeri,<br /><em>ilan fiyatından büyüktür.</em></h2>
          <p>Semtin sabah sesini, pencereden düşen ışığı, doğru yatırımın sessiz güvenini de hesaba katarız. Çünkü gayrimenkul, rakamlardan önce bir yaşam kararıdır.</p>
          <blockquote>“Doğru adres, insanın kendine verdiği en büyük sözlerden biridir.”</blockquote>
          <a href="#iletisim">Bizi tanıyın <span>↗</span></a>
        </div>
      </section>

      <section className="membership" id="uyelik">
        <div className="membership-intro">
          <span>09 / MIRA ÜYELİK</span>
          <p>Demo üyelik modeli</p>
          <h2>İlk yıl<br /><em>bizden.</em></h2>
          <div><strong>12</strong><span>AY<br />ÜCRETSİZ</span></div>
        </div>
        <div className="membership-content">
          <p className="membership-lead">Müşteri, danışman ve kurumsal ekipleri tek ağda buluşturan üyelik kanalları. İlk 12 ay ücretsiz kullanım vizyonuyla tasarlandı.</p>
          <div className="membership-plans">
            {[
              ["Bireysel", "Favoriler, akıllı arama ve yeni ilanlara erken erişim", "01"],
              ["Profesyonel", "Portföy vitrini, talep takibi ve danışman profili", "02"],
              ["Kurumsal", "Ekip yönetimi, çoklu kullanıcı ve performans raporları", "03"],
            ].map(([title, description, number]) => (
              <article key={title}><span>{number}</span><h3>{title}</h3><p>{description}</p><div><strong>₺0</strong><small>/ ilk 12 ay</small></div><a href="#iletisim">Ön kayıt <b>↗</b></a></article>
            ))}
          </div>
          <small className="membership-note">Bu alan demo amaçlıdır. Üyelik altyapısı ve ödeme sistemi üretim aşamasında devreye alınacaktır.</small>
        </div>
      </section>

      <section className="testimonials">
        <div className="section-heading"><div><span className="eyebrow">10 / GERÇEK SESLER</span><h2>İyi kararların<br /><em>ardından.</em></h2></div><span className="testimonial-index">MIRA / YORUMLAR</span></div>
        <div className="testimonial-grid">
          <article><div className="stars">★★★★★</div><p>“Üç haftada doğru alıcıyla buluştuk. Fiyatlama ve süreç yönetimi baştan sona çok netti.”</p><footer><strong>Selin A.</strong><span>Ev sahibi · İstanbul</span></footer></article>
          <article><div className="stars">★★★★★</div><p>“Şehir dışından ev ararken tüm detayları bizim için kontrol ettiler. Güven duygusu paha biçilemezdi.”</p><footer><strong>Mert &amp; Derya K.</strong><span>Alıcı · İzmir</span></footer></article>
          <article><div className="stars">★★★★★</div><p>“Sadece seçenek sunmadılar; gerçek ihtiyacımızı anlamamıza yardımcı oldular. İçimize sinen evi bulduk.”</p><footer><strong>Aylin T.</strong><span>Kiracı · Ankara</span></footer></article>
        </div>
      </section>

      <section className="contact" id="iletisim">
        <div className="contact-copy">
          <span className="eyebrow">11 / BAŞLANGIÇ</span>
          <h2>Bir sonraki<br /><em>adresiniz?</em></h2>
          <p>Kısa bir not bırakın. Size daha fazla ilan değil, daha net bir yönle dönelim.</p>
          <div className="contact-lines"><a href="tel:+905550000000">+90 555 000 00 00</a><a href="mailto:danisman@miraemlak.com">danisman@miraemlak.com</a></div>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <label><span>Adınız soyadınız</span><input name="name" type="text" placeholder="Ad Soyad" required /></label>
          <label><span>Telefon numaranız</span><input name="phone" type="tel" placeholder="05__ ___ __ __" required /></label>
          <label className="full"><span>Nasıl yardımcı olabiliriz?</span><textarea name="note" rows={3} placeholder="Satmak, kiralamak veya yeni bir mülk bulmak istiyorum..." required /></label>
          <button type="submit">MIRA ile konuş <span>↗</span></button>
          {contactSent && <p className="form-note" role="status">E-posta uygulamanız açılıyor. Mesajı göndererek talebinizi tamamlayabilirsiniz.</p>}
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><a className="brand footer-brand" href="#anasayfa"><span className="brand-mark">M</span><span>MIRA</span></a><p>GELECEĞİN<br />GAYRİMENKUL AĞI.</p></div>
        <div className="footer-bottom"><span>© 2026 Mira Emlak. Tüm hakları saklıdır.</span><div><a href="#ilanlar">İlanlar</a><a href="#hizmetler">Hizmetler</a><a href="#iletisim">İletişim</a></div></div>
      </footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="listing-modal" role="dialog" aria-modal="true" aria-labelledby="listing-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="İlan detayını kapat" onClick={() => setSelected(null)}>×</button>
            <img src={selected.image} alt={selected.title} />
            <div className="modal-copy"><span className="property-badge inline">{selected.intent}</span><small>{selected.district}, {selected.city}</small><h2 id="listing-title">{selected.title}</h2><p>{selected.description}</p><ul><li><span>Oda</span><strong>{selected.rooms}</strong></li><li><span>Alan</span><strong>{selected.area}</strong></li><li><span>Detay</span><strong>{selected.floor}</strong></li></ul><div className="modal-price"><strong>{selected.price}</strong><a href="#iletisim" onClick={() => setSelected(null)}>Bilgi alın →</a></div></div>
          </section>
        </div>
      )}
    </main>
  );
}
