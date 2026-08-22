"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

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
  const [heroTransitioning, setHeroTransitioning] = useState(false);
  const [filmPlaying, setFilmPlaying] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [motionPaused, setMotionPaused] = useState(false);
  const [lifestyle, setLifestyle] = useState("Denize yakın");
  const heroRef = useRef<HTMLElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const heroTimer = useRef<number | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || motionPaused) return;
    const interval = window.setInterval(() => {
      setHeroTransitioning(true);
      heroTimer.current = window.setTimeout(() => {
        setHeroIndex((index) => (index + 1) % heroListings.length);
        setHeroTransitioning(false);
      }, 520);
    }, 7600);
    return () => {
      window.clearInterval(interval);
      if (heroTimer.current) window.clearTimeout(heroTimer.current);
    };
  }, [heroListings.length, motionPaused]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        hero.style.setProperty("--pointer-x", `${x * 22}px`);
        hero.style.setProperty("--pointer-y", `${y * 16}px`);
      });
    };
    const leave = () => {
      hero.style.setProperty("--pointer-x", "0px");
      hero.style.setProperty("--pointer-y", "0px");
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      window.cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .13, rootMargin: "0px 0px -7%" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.sessionStorage.getItem("realyerin-opening-seen")) {
      setIntroVisible(false);
      return;
    }
    document.body.classList.add("ry-opening-lock");
    const timer = window.setTimeout(closeIntro, 2300);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("ry-opening-lock");
    };
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        main.style.setProperty("--page-progress", `${height > 0 ? (window.scrollY / height) * 100 : 0}%`);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
        cursor.classList.add("is-visible");
        cursor.classList.toggle("is-active", Boolean((event.target as Element | null)?.closest("a,button,select,input,textarea")));
      });
    };
    const down = () => cursor.classList.add("is-down");
    const up = () => cursor.classList.remove("is-down");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  function closeIntro() {
    setIntroVisible(false);
    document.body.classList.remove("ry-opening-lock");
    window.sessionStorage.setItem("realyerin-opening-seen", "1");
  }

  function showHero(index: number) {
    if (index === heroIndex || heroTransitioning) return;
    if (heroTimer.current) window.clearTimeout(heroTimer.current);
    setHeroTransitioning(true);
    heroTimer.current = window.setTimeout(() => {
      setHeroIndex(index);
      setHeroTransitioning(false);
    }, 520);
  }

  function tiltCard(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - .5) * -4;
    const rotateY = ((event.clientX - rect.left) / rect.width - .5) * 5;
    card.style.setProperty("--tilt-x", `${rotateX}deg`);
    card.style.setProperty("--tilt-y", `${rotateY}deg`);
  }

  function resetCard(event: ReactPointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }

  async function startFilm() {
    if (!filmRef.current) return;
    try { await filmRef.current.play(); } catch { setFilmPlaying(false); }
  }

  function openFilmFullscreen() {
    const video = filmRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!video) return;
    if (video.requestFullscreen) void video.requestFullscreen();
    else video.webkitEnterFullscreen?.();
  }

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
    <main ref={mainRef} className={`mira-site market-v9 market-v10 market-v11 ${motionPaused ? "motion-paused" : ""}`} dir={language === "AR" ? "rtl" : "ltr"}>
      <div className={`ry-opening ${introVisible ? "is-active" : "is-finished"}`} aria-hidden={!introVisible}>
        <div className="opening-coordinates"><span>41° 02′ N</span><i /><span>29° 00′ E</span></div>
        <div className="opening-mark"><span>REAL</span><span>YERİN</span></div>
        <p>Bir ilan değil.<br /><b>Yeni bir hayatın ilk karesi.</b></p>
        <div className="opening-progress"><i /></div>
        <small>EMLAKTA YENİ BİR YER / 2026</small>
        <button type="button" onClick={closeIntro} tabIndex={introVisible ? 0 : -1}>Geç <span>↗</span></button>
      </div>
      <div ref={cursorRef} className="ry-cursor" aria-hidden="true"><i /><span /></div>
      <div className="ry-page-progress" aria-hidden="true"><i /></div>
      <header className="mira-header">
        <a className="mira-brand" href="#anasayfa" aria-label="RealYerin ana sayfa"><span className="mira-monogram">R<span>●</span></span><span className="mira-wordmark">REALYERİN<small>YERİNİ BUL. YERİNDE BUL.</small></span></a>
        <nav className={menuOpen ? "open" : ""} aria-label="Ana menü"><a href="#portfoy" onClick={() => { setIntent("Satılık"); setMenuOpen(false); }}>Satılık</a><a href="#portfoy" onClick={() => { setIntent("Kiralık"); setMenuOpen(false); }}>Kiralık</a><a href="#portfoy" onClick={() => setMenuOpen(false)}>Yeni projeler</a><a href="#tanitim" onClick={() => setMenuOpen(false)}>RealYerin'i tanı</a></nav>
        <div className="mira-header-actions"><label className="mira-language"><span className="sr-only">Dil seçin</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Dil seçin"><option>TR</option><option>EN</option><option>DE</option><option>AR</option></select></label><button className="ry-motion-toggle" type="button" aria-label={motionPaused ? "Hareketi başlat" : "Hareketi durdur"} aria-pressed={motionPaused} onClick={() => setMotionPaused((value) => !value)}><span>{motionPaused ? "▶" : "Ⅱ"}</span>{motionPaused ? "Başlat" : "Durdur"}</button><a className="mira-contact-link" href="#uyelik">İlan ver<span>↗</span></a><button className="mira-menu" type="button" aria-label="Menüyü aç veya kapat" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "×" : "☰"}</button></div>
      </header>

      <section ref={heroRef} className={`mira-hero ${heroTransitioning ? "is-transitioning" : ""}`} id="anasayfa">
        <div className="hero-photo" key={`photo-${heroListing.id}`}><img src={heroListing.image} alt={heroListing.title} /><span /></div>
        <div className="hero-transition" aria-hidden="true"><span>REALYERİN</span></div>
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-ghost" aria-hidden="true">YERİN</div>
        <div className="hero-frame" aria-hidden="true"><span>41° 02′ N / 29° 00′ E</span><span>SEÇKİ / 0{heroIndex + 1}</span></div>
        <div className="hero-copy" key={`copy-${heroListing.id}`}>
          <p className="hero-kicker"><i /> TÜRKİYE'NİN YENİ EMLAK SİSTEMİ</p>
          <h1><span>YERİNİ</span><span className="outline-text">BUL.</span></h1>
          <a className="hero-listing-bridge" href="#portfoy"><strong>24.800+</strong><span>doğrulanmış yer<i>↓</i></span></a>
          <div className="hero-feature-copy">
            <span className="hero-location"><b>●</b> ÖNERİLEN / 0{heroIndex + 1} · {heroListing.district} / {heroListing.city}</span>
            <h2>{heroListing.title}</h2>
            <p>{heroListing.description}</p>
          </div>
          <div className="hero-details"><span><b>{heroListing.rooms}</b><small>ODA</small></span><span><b>{heroListing.area}</b><small>BRÜT ALAN</small></span><span><b>{heroListing.floor}</b><small>KONUM</small></span></div>
          <div className="hero-price"><span>Satış değeri</span><strong>{heroListing.price}</strong><small><i /> Kimliği ve konumu doğrulandı</small></div>
          <div className="hero-links"><button type="button" onClick={() => setSelected(heroListing)}>Yeri deneyimle<span>↗</span></button><a href="#portfoy">Tüm seçki <span>↓</span></a></div>
        </div>
        <aside className="hero-proof"><span>RY</span><strong>DOĞRULANDI</strong><small>İlan no. RY-{String(heroListing.id).padStart(5, "0")}</small></aside>
        <div className="hero-selector" aria-label="Önerilen ilanlar">{heroListings.map((home, index) => <button type="button" className={heroIndex === index ? "active" : ""} key={home.id} onClick={() => showHero(index)} aria-label={`${home.title} ilanını göster`}><span>0{index + 1}</span><img src={home.image} alt="" /><small><b>{home.district}</b>{home.kind}</small>{heroIndex === index && <i key={`progress-${heroListing.id}`} className="hero-auto-progress" aria-hidden="true" />}</button>)}</div>
        <div className="hero-scroll-cue" aria-hidden="true"><span>KEŞFETMEK İÇİN KAYDIR</span><i /></div>
        <div className="hero-cinema-bars" aria-hidden="true"><span /><span /></div>
        <form className="mira-search" onSubmit={submitSearch}><div className="search-title"><span>YERİNİ BUL</span><small>24.800+ doğrulanmış ilan</small></div><div className="mira-search-tabs" role="group" aria-label="İlan türü">{(["Satılık", "Kiralık"] as const).map((item) => <button type="button" className={intent === item ? "active" : ""} onClick={() => setIntent(item)} key={item}>{item}</button>)}</div><label><span>Konum</span><select value={city} onChange={(event) => setCity(event.target.value)}><option value="Tümü">Tüm Türkiye</option><option>İstanbul</option><option>İzmir</option><option>Ankara</option><option>Bursa</option></select></label><label><span>Mülk türü</span><select value={kind} onChange={(event) => setKind(event.target.value)}><option>Tümü</option><option>Konut</option><option>Villa</option><option>Arsa</option><option>İş yeri</option></select></label><button className="mira-search-button" type="submit"><span>{filteredListings.length} eşleşme hazır</span><b>Göster <i>↗</i></b></button></form>
      </section>

      <section className="ry-trust" aria-label="RealYerin platform bilgileri" data-reveal="fade">
        <p><i /> Şu an 326 kişi RealYerin'de yeni bir yer arıyor</p>
        <div><span><strong>24.800+</strong><small>DOĞRULANMIŞ İLAN</small></span><span><strong>81</strong><small>ŞEHİRDE ERİŞİM</small></span><span><strong>4,9/5</strong><small>ARAMA DENEYİMİ</small></span><span><strong>12 ay</strong><small>ÜCRETSİZ ÜYELİK</small></span></div>
      </section>

      <section className="ry-kinetic" aria-label="RealYerin emlak kategorileri"><div>{["SATILIK", "KİRALIK", "YENİ PROJELER", "VİLLA", "ARSA", "İŞ YERİ", "SATILIK", "KİRALIK", "YENİ PROJELER", "VİLLA", "ARSA", "İŞ YERİ"].map((item, index) => <span key={`${item}-${index}`}>{item}<i>×</i></span>)}</div></section>

      <section className="ry-categories" aria-label="Emlak kategorileri" data-reveal="split">
        <header><span className="section-kicker">01 / HIZLI KEŞİF</span><h2>Aradığın yer,<br /><em>bir seçim kadar yakın.</em></h2><p>Konut, villa, arsa veya iş yeri. Türkiye'nin her yerindeki güncel ilanlara tek noktadan ulaş.</p></header>
        <div className="ry-category-grid">
          {[["Konut", "18.240 ilan", listings[0].image], ["Villa", "3.180 ilan", listings[1].image], ["Arsa", "2.760 ilan", listings[5].image], ["İş yeri", "1.940 ilan", listings[3].image]].map(([title, count, image], index) => <button type="button" key={title} onClick={() => { setKind(title); document.getElementById("portfoy")?.scrollIntoView({ behavior: "smooth" }); }}><img src={image} alt="" loading="lazy" /><b>0{index + 1}</b><span>{title}</span><small>{count}</small><i>KEŞFET ↗</i></button>)}
        </div>
      </section>

      <section className="ry-life-search" data-reveal="split" aria-labelledby="life-search-title">
        <div className="ry-life-copy"><span className="section-kicker">02 / REALYERİN RADAR</span><h2 id="life-search-title">Evi değil.<br /><em>Hayatı tarif et.</em></h2><p>Oda sayısını sonra konuşuruz. Önce nasıl bir sabaha uyanmak, neye yakın olmak ve nasıl yaşamak istediğini seç.</p><small>AKILLI YAŞAM EŞLEŞTİRMESİ / BETA</small></div>
        <div className="ry-radar-panel"><div className="ry-radar-visual" aria-hidden="true"><i /><i /><i /><span>R</span><b>{lifestyle.toUpperCase()}</b></div><p>Nasıl bir yer arıyorsun?</p><div className="ry-life-options">{["Denize yakın", "Bahçeli yaşam", "Yatırıma uygun", "Şehre 20 dakika", "Sessiz ve sakin"].map((item) => <button type="button" className={lifestyle === item ? "active" : ""} onClick={() => setLifestyle(item)} key={item}>{item}<span>{lifestyle === item ? "●" : "+"}</span></button>)}</div><button className="ry-radar-action" type="button" onClick={() => document.getElementById("portfoy")?.scrollIntoView({ behavior: "smooth" })}><span><small>{lifestyle} için</small><b>286 eşleşme bulundu</b></span><i>↗</i></button></div>
      </section>

      <section className="ry-listings" id="portfoy" data-reveal="up">
        <header className="ry-section-head"><div><span className="section-kicker">03 / SANA GÖRE SEÇTİK</span><h2>Yeni, doğrulanmış<br /><em>ve dikkat çeken ilanlar.</em></h2></div><div className="ry-filter">{(["Satılık", "Kiralık"] as const).map((item) => <button type="button" className={intent === item ? "active" : ""} onClick={() => setIntent(item)} key={item}>{item}</button>)}<button type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Tümü</button></div></header>
        {filteredListings.length ? <div className="ry-listing-grid">{filteredListings.map((home, index) => <article className={index === 0 ? "ry-card featured" : "ry-card"} key={home.id} data-tilt onPointerMove={tiltCard} onPointerLeave={resetCard}><div className="ry-card-image"><img src={home.image} alt={home.title} loading="lazy" /><span className="ry-card-badge">{index === 0 ? "HAFTANIN İLANI" : home.intent.toUpperCase()}</span><button type="button" className={favorites.includes(home.id) ? "ry-fav saved" : "ry-fav"} aria-label={`${home.title} favori`} onClick={() => setFavorites((items) => items.includes(home.id) ? items.filter((id) => id !== home.id) : [...items, home.id])}>{favorites.includes(home.id) ? "♥" : "♡"}</button><small>RY-{String(home.id).padStart(5, "0")}</small></div><div className="ry-card-copy"><span>{home.district}, {home.city}</span><h3>{home.title}</h3><ul><li>{home.rooms}</li><li>{home.area}</li><li>{home.floor}</li></ul><footer><strong>{home.price}</strong><button type="button" onClick={() => setSelected(home)}>Detaylar →</button></footer></div><span className="card-light" aria-hidden="true" /></article>)}</div> : <div className="mira-empty"><h3>Bu seçimlere uygun ilan bulunamadı.</h3><button type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Tüm ilanları göster</button></div>}
      </section>

      <section className={`ry-map map-focus-${city.toLocaleLowerCase("tr-TR")}`} id="bolgeler" data-reveal="split">
        <div className="ry-map-canvas"><div className="map-coast coast-one" aria-hidden="true" /><div className="map-coast coast-two" aria-hidden="true" /><div className="map-road road-one" aria-hidden="true" /><div className="map-road road-two" aria-hidden="true" />{[["İstanbul", "18.240", "pin-one"], ["İzmir", "3.180", "pin-two"], ["Ankara", "2.760", "pin-three"]].map(([name, count, pin]) => <button type="button" key={name} className={`map-pin ${pin} ${city === name ? "active" : ""}`} onClick={() => setCity(name)} aria-label={`${name} ilanlarını haritada göster`}><i>{count}</i></button>)}<b>REALYERİN<br />CANLI BÖLGE HARİTASI</b><small>{city === "İzmir" ? "38.4237° N\n27.1428° E" : city === "Ankara" ? "39.9334° N\n32.8597° E" : "41.0082° N\n28.9784° E"}</small><span className="map-scan" aria-hidden="true" /></div>
        <div className="ry-map-copy"><span className="section-kicker">04 / BÖLGEYİ HİSSET</span><h2>Evden önce<br /><em>çevresini keşfet.</em></h2><p>İlanlara yalnızca oda sayısıyla değil; yaşam ritmi, ulaşım, sahile yakınlık ve yatırım hareketiyle bak.</p><div className="ry-city-list">{[["İstanbul", "18.240 ilan", "+%12"], ["İzmir", "4.620 ilan", "+%18"], ["Ankara", "3.980 ilan", "+%09"]].map(([name, count, trend], index) => <button type="button" className={city === name ? "active" : ""} key={name} onClick={() => setCity(name)}><span>0{index + 1}</span><strong>{name}<small>{count}</small></strong><b>{trend}<small>SON 30 GÜN</small></b><i>↗</i></button>)}</div><button className="ry-map-results" type="button" onClick={() => document.getElementById("portfoy")?.scrollIntoView({ behavior: "smooth" })}>{city === "Tümü" ? "Tüm bölge ilanlarını gör" : `${city} ilanlarını gör`} <span>→</span></button></div>
      </section>

      <section className="ry-confidence" id="hizmetler" data-reveal="split">
        <div className="ry-confidence-copy"><span className="section-kicker">05 / NEDEN REALYERİN?</span><h2>İlan çok olabilir.<br /><em>Güven bir tanedir.</em></h2><p>Sahte ilanı, eksik bilgiyi ve zaman kaybını azaltmak için ilanları yayın öncesinde kontrol ediyor; arayanla ilan vereni doğrudan buluşturuyoruz.</p><a href="#uyelik">Platformu keşfet <span>↗</span></a></div>
        <div className="ry-confidence-list">{services.map(([number, title, description]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><b>✓</b></article>)}</div>
      </section>

      <section className={`mira-film ry-film ${filmPlaying ? "is-playing" : ""}`} id="tanitim" data-reveal="cinema"><div className="film-heading"><span className="section-kicker">06 / {copy.filmLabel}</span><h2>{copy.filmTitle}</h2><p>{copy.filmBody}</p><div className="film-index"><span>01</span><i /><small>00:11</small></div></div><div className="film-stage"><video ref={filmRef} controls playsInline preload="metadata" poster={listings[0].image} aria-label="RealYerin sinematik tanıtım filmi" onPlay={() => setFilmPlaying(true)} onPause={() => setFilmPlaying(false)} onEnded={() => setFilmPlaying(false)}><source src={`${assetBase}/mira-cinematic.mp4`} type="video/mp4" /><track kind="captions" src={`${assetBase}/subtitles/mira-tr.vtt`} srcLang="tr" label="Türkçe" default /><track kind="captions" src={`${assetBase}/subtitles/mira-en.vtt`} srcLang="en" label="English" /><track kind="captions" src={`${assetBase}/subtitles/mira-de.vtt`} srcLang="de" label="Deutsch" /><track kind="captions" src={`${assetBase}/subtitles/mira-ar.vtt`} srcLang="ar" label="العربية" /></video><button className="film-curtain" type="button" onClick={startFilm} aria-label="RealYerin tanıtım filmini oynat"><span><i>▶</i><b>FİLMİ OYNAT</b><small>SESİ AÇIK İZLEYİN</small></span></button><div className="film-strip" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div><span className="film-stamp">REALYERİN / ORİJİNAL</span>{signLanguage && <aside className="mira-sign" aria-label={copy.signTitle}><div className="sign-figure" aria-hidden="true"><span /><i /></div><strong>{copy.signTitle}</strong><p>{copy.signBody}</p></aside>}<div className="film-controls"><label>{copy.captions}<select value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option>TR</option><option>EN</option><option>DE</option><option>AR</option></select></label><button type="button" className={signLanguage ? "active" : ""} onClick={() => setSignLanguage((value) => !value)}>{copy.sign}<b>{signLanguage ? "AÇIK" : "KAPALI"}</b></button><button type="button" onClick={openFilmFullscreen} aria-label="Tam ekran izle">Tam ekran <b>⛶</b></button></div></div></section>

      <section className="ry-membership" id="uyelik" data-reveal="up">
        <header><span className="section-kicker">07 / REALYERİN ÜYELİK</span><h2>İlk yıl herkes için<br /><em>tamamen ücretsiz.</em></h2><p>İster evini arıyor ol, ister ilan veriyor, ister portföy yönetiyor ol. Sana uygun kanal hazır.</p></header>
        <div className="ry-plans">{[["01", "Bireysel", "Favoriler, kayıtlı aramalar ve yeni ilan bildirimleri", "Ücretsiz"], ["02", "İlan sahibi", "İlan yayınlama, mesaj yönetimi ve performans özeti", "Ücretsiz"], ["03", "Profesyonel", "Kurumsal vitrin, portföy yönetimi ve ekip araçları", "Ücretsiz"]].map(([number, title, description, price]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{description}</p><div><strong>{price}</strong><small>/ ilk 12 ay</small></div><a href="#iletisim">Ön kayıt oluştur <b>↗</b></a></article>)}</div>
      </section>

      <section className="ry-owner" id="iletisim" data-reveal="split">
        <div><span className="section-kicker">08 / SENİN YERİN</span><h2>Bir mülkün mü var?<br /><em>Doğru kişiye göster.</em></h2><p>Bilgilerini bırak; RealYerin ekibi ilanını hazırlamak veya aradığın mülkü bulmak için seninle iletişime geçsin.</p><a href="tel:+905550000000">+90 555 000 00 00</a><a href="mailto:merhaba@realyerin.com">merhaba@realyerin.com</a></div>
        <form className="ry-owner-form" onSubmit={submitContact}><div><label><span>Adınız soyadınız</span><input name="name" type="text" placeholder="Ad Soyad" required /></label><label><span>Telefon</span><input name="phone" type="tel" placeholder="05__ ___ __ __" required /></label></div><label><span>Talebiniz</span><textarea name="note" rows={4} placeholder="İlan vermek veya bir mülk bulmak istiyorum..." required /></label><button type="submit">Beni arayın <span>→</span></button>{contactSent && <p role="status">E-posta uygulamanız açılıyor. Mesajı göndererek talebinizi tamamlayabilirsiniz.</p>}</form>
      </section>

      <footer className="ry-footer"><div className="ry-footer-top"><a className="mira-brand footer" href="#anasayfa"><span className="mira-monogram">R</span><span className="mira-wordmark">REALYERİN<small>TÜRKİYE'NİN EMLAK PLATFORMU</small></span></a><p>Aradığın yer.<br /><b>Gerçekten yerinde.</b></p></div><div className="ry-footer-links"><span>© 2026 RealYerin. Tüm hakları saklıdır.</span><nav><a href="#portfoy">Satılık</a><a href="#portfoy">Kiralık</a><a href="#uyelik">Üyelik</a><a href="#iletisim">İletişim</a></nav></div></footer>

      <nav className="ry-mobile-dock" aria-label="Mobil hızlı menü"><a href="#anasayfa"><i>⌂</i><span>Ana sayfa</span></a><a href="#portfoy"><i>⌕</i><span>İlan ara</span></a><button type="button" onClick={() => document.getElementById("portfoy")?.scrollIntoView({ behavior: "smooth" })}><i>♡</i><span>Favoriler</span></button><a className="primary" href="#uyelik"><i>＋</i><span>İlan ver</span></a></nav>

      {selected && <div className="mira-modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="mira-modal" role="dialog" aria-modal="true" aria-labelledby="mira-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" aria-label="Kapat" onClick={() => setSelected(null)}>×</button><div className="modal-image"><img src={selected.image} alt={selected.title} /><span>{selected.intent}</span></div><div className="modal-content"><small>{selected.district} / {selected.city}</small><h2 id="mira-modal-title">{selected.title}</h2><p>{selected.description}</p><ul><li><span>Oda</span><strong>{selected.rooms}</strong></li><li><span>Alan</span><strong>{selected.area}</strong></li><li><span>Detay</span><strong>{selected.floor}</strong></li></ul><footer><strong>{selected.price}</strong><a href="#iletisim" onClick={() => setSelected(null)}>Bilgi alın ↗</a></footer></div></section></div>}
    </main>
  );
}
