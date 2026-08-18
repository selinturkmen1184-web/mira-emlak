"use client";

import { FormEvent, useMemo, useState } from "react";

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

export default function Home() {
  const [intent, setIntent] = useState<"Satılık" | "Kiralık">("Satılık");
  const [city, setCity] = useState("Tümü");
  const [kind, setKind] = useState("Tümü");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);

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
    <main>
      <header className="site-header">
        <a className="brand" href="#anasayfa" aria-label="Mira Emlak ana sayfa">
          <span className="brand-mark">M</span>
          <span>Mira <strong>Emlak</strong></span>
        </a>
        <nav className={menuOpen ? "open" : ""} aria-label="Ana menü">
          <a href="#ilanlar" onClick={() => setMenuOpen(false)}>İlanlar</a>
          <a href="#hizmetler" onClick={() => setMenuOpen(false)}>Hizmetlerimiz</a>
          <a href="#hakkimizda" onClick={() => setMenuOpen(false)}>Hakkımızda</a>
          <a href="#iletisim" onClick={() => setMenuOpen(false)}>İletişim</a>
        </nav>
        <div className="header-actions">
          <a className="header-cta" href="#iletisim">Ücretsiz değerleme</a>
          <button className="menu-button" type="button" aria-label="Menüyü aç veya kapat" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button>
        </div>
      </header>

      <section className="hero" id="anasayfa">
        <div className="hero-copy">
          <span className="hero-index">M / 01 — Seçkin gayrimenkuller</span>
          <h1><span>Bir ev değil,</span><strong>doğru hayatı</strong><em>seçin.</em></h1>
          <p>Herkes ilan gösterir. Biz yaşam biçiminize, yatırım hedefinize ve yarınınıza uyan adresleri seçeriz.</p>
          <div className="hero-links">
            <a href="#ilanlar">Portföyü keşfet <span>↘</span></a>
            <a href="#iletisim">Mülkünüzü değerlendirelim</a>
          </div>
        </div>

        <div className="hero-visual">
          <img src={listings[0].image} alt="Boğaz manzaralı seçkin Mira Emlak portföyü" />
          <div className="hero-visual-meta"><span>İstanbul / 2026</span><span>Mira Selected</span></div>
          <button type="button" onClick={() => setSelected(listings[0])} aria-label="Öne çıkan ilanı incele">↗</button>
          <div className="hero-visual-caption">
            <small>Beşiktaş · İstanbul</small>
            <strong>Boğaz hattında<br />yeni bir perspektif.</strong>
            <span>18.750.000 TL</span>
          </div>
        </div>

        <form className="property-search" onSubmit={submitSearch}>
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
          <button className="search-button" type="submit">{filteredListings.length} ilanı göster <span>→</span></button>
        </form>

        <div className="hero-stats" aria-label="Mira Emlak istatistikleri">
          <div><strong>12</strong><span>yıllık uzmanlık</span></div>
          <div><strong>480</strong><span>başarılı eşleşme</span></div>
          <div><strong>%98</strong><span>tavsiye oranı</span></div>
        </div>
      </section>

      <div className="editorial-ticker" aria-hidden="true">
        <div><span>Seçilmiş portföy</span><b>✦</b><span>Yerel uzmanlık</span><b>✦</b><span>Doğru yatırım</span><b>✦</b><span>Seçilmiş portföy</span><b>✦</b><span>Yerel uzmanlık</span></div>
      </div>

      <section className="category-strip" aria-label="Gayrimenkul kategorileri">
        <p>Portföyü yaşam biçiminize göre keşfedin</p>
        <div>
          {["Konut", "Villa", "Arsa", "İş yeri"].map((item, index) => (
            <button key={item} type="button" onClick={() => { setKind(item); document.getElementById("ilanlar")?.scrollIntoView({ behavior: "smooth" }); }}>
              <i>0{index + 1}</i><span>{item}</span><small>↗</small>
            </button>
          ))}
        </div>
      </section>

      <section className="featured" id="ilanlar">
        <div className="section-heading">
          <div><span className="eyebrow">Mira / Selected</span><h2>Piyasada olan değil,<br /><em>sizin için seçilenler.</em></h2></div>
          <p>{filteredListings.length} ilan bulundu</p>
        </div>
        <div className="listing-filter" aria-label="Hızlı ilan filtresi">
          <div>
            {(["Satılık", "Kiralık"] as const).map((item) => <button key={item} className={intent === item ? "active" : ""} type="button" onClick={() => setIntent(item)}>{item}</button>)}
          </div>
          <button className={city === "Tümü" && kind === "Tümü" ? "reset hidden" : "reset"} type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Filtreleri temizle ×</button>
        </div>

        {filteredListings.length > 0 ? (
          <div className="property-grid">
            {filteredListings.map((home) => (
              <article className="property-card" key={home.id}>
                <div className="property-image-wrap">
                  <img src={home.image} alt={home.title} loading="lazy" />
                  <span className="property-badge">{home.intent}</span>
                  {home.featured && <span className="featured-badge">Öne çıkan</span>}
                  <button className={favorites.includes(home.id) ? "favorite saved" : "favorite"} type="button" aria-label={`${home.title} ilanını favorilere ${favorites.includes(home.id) ? "çıkar" : "ekle"}`} onClick={() => toggleFavorite(home.id)}>{favorites.includes(home.id) ? "♥" : "♡"}</button>
                </div>
                <div className="property-body">
                  <span>{home.district}, {home.city}</span>
                  <h3>{home.title}</h3>
                  <ul aria-label="İlan özellikleri"><li>{home.rooms}</li><li>{home.area}</li><li>{home.floor}</li></ul>
                  <div><strong>{home.price}</strong><button type="button" onClick={() => setSelected(home)}>İncele →</button></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><span>⌕</span><h3>Bu filtrelere uygun ilan bulunamadı.</h3><p>Filtreleri temizleyerek diğer portföylere göz atabilirsiniz.</p><button type="button" onClick={() => { setCity("Tümü"); setKind("Tümü"); }}>Tüm ilanları göster</button></div>
        )}
      </section>

      <section className="value-band">
        <p>Mülkünüzü satmayı veya kiralamayı mı düşünüyorsunuz?</p>
        <h2>Mülkünüz bir ilandan<br /><em>daha fazlasını hak ediyor.</em></h2>
        <a href="#iletisim">Özel değerleme dosyanızı isteyin <span>↗</span></a>
      </section>

      <section className="services" id="hizmetler">
        <div className="services-intro">
          <span className="eyebrow">Neden Mira Emlak?</span>
          <h2>Veri kadar<br /><em>sezgiye de</em> inanırız.</h2>
          <p>Metrekareyi herkes hesaplar. Biz sokağın ritmini, semtin yarınını ve bir evin size nasıl hissettireceğini de hesaba katarız.</p>
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
          <span className="eyebrow">Yerel uzman, güçlü temsil</span>
          <h2>Önce sizi anlar,<br /><em>sonra adresi buluruz.</em></h2>
          <p>Önce sizi, hedeflerinizi ve zamanlamanızı anlıyoruz. Ardından bölge verileriyle net bir yol haritası çıkarıp sürecin her anında ulaşılabilir oluyoruz.</p>
          <blockquote>“Evinizi değil, hayatınızın bir sonraki adımını birlikte planlıyoruz.”</blockquote>
          <a href="#iletisim">Tanışma görüşmesi planla <span>→</span></a>
        </div>
      </section>

      <section className="testimonials">
        <div className="section-heading"><div><span className="eyebrow">Müşteri deneyimleri</span><h2>Kararından emin olanlar.</h2></div><span className="testimonial-index">03 / gerçek hikâye</span></div>
        <div className="testimonial-grid">
          <article><div className="stars">★★★★★</div><p>“Üç haftada doğru alıcıyla buluştuk. Fiyatlama ve süreç yönetimi baştan sona çok netti.”</p><footer><strong>Selin A.</strong><span>Ev sahibi · İstanbul</span></footer></article>
          <article><div className="stars">★★★★★</div><p>“Şehir dışından ev ararken tüm detayları bizim için kontrol ettiler. Güven duygusu paha biçilemezdi.”</p><footer><strong>Mert &amp; Derya K.</strong><span>Alıcı · İzmir</span></footer></article>
          <article><div className="stars">★★★★★</div><p>“Sadece seçenek sunmadılar; gerçek ihtiyacımızı anlamamıza yardımcı oldular. İçimize sinen evi bulduk.”</p><footer><strong>Aylin T.</strong><span>Kiracı · Ankara</span></footer></article>
        </div>
      </section>

      <section className="contact" id="iletisim">
        <div className="contact-copy">
          <span className="eyebrow">İlk adımı birlikte atalım</span>
          <h2>Sıradaki adresiniz<br /><em>bir konuşmayla başlasın.</em></h2>
          <p>Formu doldurun; ihtiyacınızı dinlemek ve size özel yol haritasını paylaşmak için geri dönüş yapalım.</p>
          <div className="contact-lines"><a href="tel:+905550000000">+90 555 000 00 00</a><a href="mailto:danisman@miraemlak.com">danisman@miraemlak.com</a></div>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <label><span>Adınız soyadınız</span><input name="name" type="text" placeholder="Ad Soyad" required /></label>
          <label><span>Telefon numaranız</span><input name="phone" type="tel" placeholder="05__ ___ __ __" required /></label>
          <label className="full"><span>Nasıl yardımcı olabiliriz?</span><textarea name="note" rows={3} placeholder="Satmak, kiralamak veya yeni bir mülk bulmak istiyorum..." required /></label>
          <button type="submit">Görüşme talebi oluştur <span>→</span></button>
          {contactSent && <p className="form-note" role="status">E-posta uygulamanız açılıyor. Mesajı göndererek talebinizi tamamlayabilirsiniz.</p>}
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><a className="brand footer-brand" href="#anasayfa"><span className="brand-mark">M</span><span>Mira <strong>Emlak</strong></span></a><p>Seçilmiş adresler.<br />Düşünülmüş kararlar.</p></div>
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
