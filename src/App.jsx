import { useEffect, useRef, useState } from 'react'

/* ================= data ================= */

const EVENT_DATE = new Date('2026-12-19T16:00:00+07:00')

const lineup = [
  { name: 'Hoshizora Reia', genre: 'Anison', role: 'Headliner · Hari 1', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop' },
  { name: 'DJ Tsukuyomi', genre: 'EDM / Hardstyle', role: 'Headliner · Hari 2', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
  { name: 'Sora & The Wanderers', genre: 'J-Pop Band', role: 'Sanctuary Stage', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop' },
  { name: 'Neon Kitsune', genre: 'City Pop / Vocaloid', role: "Witch's Hollow", img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
  { name: 'Galdos Orchestra', genre: 'Anime Orchestra', role: "Dragon's Roost", img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop' },
  { name: 'Mira Velvette', genre: 'Solo Ballad', role: 'Sanctuary Stage', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop' },
]

const stages = [
  {
    name: 'Sanctuary Stage',
    tag: 'Panggung Utama',
    desc: 'Panggung terbesar dengan tata cahaya senja raksasa. Anison, J-pop, dan penampilan orkestra penutup tiap malamnya.',
    meta: 'Kapasitas 10.000 · Open gate 15.00',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: "Witch's Hollow",
    tag: 'EDM / Dance',
    desc: 'Kubah dansa bawah tanah. DJ set hardstyle dan EDM sampai tengah malam, dengan visual sihir yang nggak berhenti.',
    meta: '18+ area · Sampai 00.00',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: "Dragon's Roost",
    tag: 'Akustik / Intimate',
    desc: 'Panggung kecil beratap langit. Sesi akustik dan orkestra intim, duduk lesehan di atas rumput sintetis.',
    meta: 'Kapasitas 1.500 · Duduk santai',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
  },
]

const tiers = [
  {
    id: 'wanderer',
    name: 'Wanderer Pass',
    price: 350000,
    desc: 'Untuk penjelajah santai yang mau menikmati semua panggung.',
    feats: ['Akses 2 hari ke semua panggung', 'Area festival & food court', 'Wristband + e-ticket', 'Cosplay walk sore hari'],
    hot: false,
  },
  {
    id: 'knight',
    name: 'Knight Pass',
    price: 850000,
    desc: 'Untuk ksatria yang mau paling depan tanpa berdesakan.',
    feats: ['Semua benefit Wanderer', 'Front zone Sanctuary Stage', 'Lounge & toilet prioritas', 'Merchandise eksklusif'],
    hot: true,
  },
  {
    id: 'sage',
    name: 'Sage Pass',
    price: 1800000,
    desc: 'Untuk para sage yang mau pengalaman paling lengkap.',
    feats: ['Semua benefit Knight', 'Backstage tour', 'Meet & greet headliner', 'Jalur masuk khusus + viewing deck'],
    hot: false,
  },
]

const faqs = [
  { q: 'Apakah tiket bisa di-refund?', a: 'Tiket tidak bisa di-refund, tapi bisa dialihkan ke orang lain maksimal H-3 acara lewat email konfirmasi.' },
  { q: 'Apakah boleh cosplay?', a: 'Sangat boleh, malah dianjurkan. Ada Cosplay Walk tiap sore di area Sanctuary dan lomba kostum terbaik berhadiah.' },
  { q: 'Boleh bawa kamera?', a: 'Kamera HP boleh. Kamera profesional, drone, dan tongkat tongsis tidak diizinkan di area panggung.' },
  { q: 'Anak kecil boleh ikut?', a: 'Boleh. Anak di bawah 12 tahun wajib didampingi orang tua dan tidak disarankan masuk area depan panggung.' },
  { q: 'Bagaimana kalau hujan?', a: 'Acara tetap berjalan. Bawa jas hujan sendiri, karena payung tidak boleh dibuka di area penonton.' },
]

const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')

/* ================= hooks ================= */

function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now())
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    el.querySelectorAll('.rv').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
  return ref
}

function makeStars(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: (i * 7919) % 100,
    y: (i * 4799) % 62,
    s: 1 + ((i * 37) % 3),
    d: 2 + ((i * 13) % 5),
    o: 0.25 + ((i * 29) % 70) / 100,
  }))
}
const HERO_STARS = makeStars(130)
const FINALE_STARS = makeStars(60)

function Stars({ list }) {
  return (
    <div className="stars" aria-hidden="true">
      {list.map((st) => (
        <span
          key={st.id}
          className="star"
          style={{
            left: st.x + '%', top: st.y + '%',
            width: st.s, height: st.s,
            opacity: st.o, animationDuration: st.d + 's',
          }}
        />
      ))}
    </div>
  )
}

/* ================= app ================= */

export default function App() {
  const root = useReveal()
  const cd = useCountdown(EVENT_DATE)
  const [burger, setBurger] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [order, setOrder] = useState(null)
  const [qty, setQty] = useState(1)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = order ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [order])

  const openOrder = (tier) => {
    setOrder(tier); setQty(1); setCopied(false)
  }
  const closeOrder = () => setOrder(null)

  const copyOrder = async () => {
    if (!order) return
    const code = 'RST-' + Math.abs([...order.id].reduce((a, c) => a + c.charCodeAt(0), 0) * 7919 % 90000 + 10000)
    const text = `RE:STAGE 2026\n${order.name} x${qty}\nTotal: ${rupiah(order.price * qty)}\nKode: ${code}`
    try { await navigator.clipboard.writeText(text); setCopied(true) }
    catch { setCopied(false) }
  }

  const pad = (v) => String(v).padStart(2, '0')

  return (
    <div ref={root} className="page">
      {/* ---------- nav ---------- */}
      <header className="nav">
        <a href="#top" className="brand">
          <img src="/logo.png" alt="Logo RE:STAGE" className="brand-logo" />
          <span className="brand-name">RE:STAGE</span>
        </a>
        <nav className={`nav-links ${burger ? 'open' : ''}`}>
          <a href="#lineup" onClick={() => setBurger(false)}>Lineup</a>
          <a href="#panggung" onClick={() => setBurger(false)}>Panggung</a>
          <a href="#tiket" onClick={() => setBurger(false)}>Tiket</a>
          <a href="#faq" onClick={() => setBurger(false)}>FAQ</a>
        </nav>
        <div className="nav-cta">
          <a href="#tiket" className="btn btn-glow">Beli Tiket</a>
          <button className="burger" onClick={() => setBurger(!burger)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="hero" id="top">
        <div className="sky" aria-hidden="true" />
        <Stars list={HERO_STARS} />
        <div className="moon" aria-hidden="true" />
        <div className="hero-inner">
          <p className="eyebrow rv">Another World Music Festival · Vol. 4</p>
          <h1 className="hero-title rv">RE:STAGE</h1>
          <p className="hero-sub rv">Dua malam, tiga panggung, satu dunia lain. Festival musik bertema isekai terbesar tahun ini.</p>
          <div className="hero-pills rv">
            <span>19 – 20 Desember 2026</span>
            <span>Ecopark Ancol, Jakarta</span>
          </div>
          <div className="countdown rv" role="timer" aria-label="Hitung mundur acara">
            {[['Hari', cd.d], ['Jam', pad(cd.h)], ['Menit', pad(cd.m)], ['Detik', pad(cd.s)]].map(([l, v]) => (
              <div className="cd-box" key={l}><b>{v}</b><i>{l}</i></div>
            ))}
          </div>
          <div className="hero-cta rv">
            <a href="#tiket" className="btn btn-glow btn-lg">Amankan Tiketmu</a>
            <a href="#lineup" className="btn btn-ghost btn-lg">Lihat Lineup</a>
          </div>
        </div>
        <a href="#tentang" className="scroll-hint" aria-label="Gulir ke bawah"><span /></a>
      </section>

      {/* ---------- marquee ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array(2).fill('ANISON ✦ J-POP ✦ EDM ✦ ORCHESTRA ✦ CITY POP ✦ VOCALOID ✦ HARDSTYLE ✦ BALLAD ✦ ').map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ---------- tentang ---------- */}
      <section className="section" id="tentang">
        <div className="wrap">
          <p className="chapter rv">Chapter 01 · Tentang</p>
          <h2 className="h2 rv">Bukan sekadar konser.<br />Ini gerbang ke dunia lain.</h2>
          <p className="lead rv">RE:STAGE mengubah Ecopark Ancol jadi kota fantasi selama dua malam. Panggung raksasa, tata cahaya senja, dan 24 penampil dari Jepang sampai lokal. Datang sebagai penonton, pulang sebagai legenda.</p>
          <div className="stats">
            {[['02', 'Hari penuh'], ['03', 'Panggung'], ['24', 'Penampil'], ['15rb+', 'Penonton']].map(([n, l]) => (
              <div className="stat rv" key={l}><b>{n}</b><span>{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- lineup ---------- */}
      <section className="section" id="lineup">
        <div className="wrap">
          <p className="chapter rv">Chapter 02 · Lineup</p>
          <h2 className="h2 rv">Para bintang dari dunia lain</h2>
          <div className="lineup-grid">
            {lineup.map((a) => (
              <article className="artist rv" key={a.name}>
                <div className="artist-img"><img src={a.img} alt={a.name} loading="lazy" /></div>
                <div className="artist-body">
                  <span className="tag">{a.genre}</span>
                  <h3>{a.name}</h3>
                  <p>{a.role}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="note rv">+ 18 penampil lain diumumkan bertahap. Pantau Instagram @restage.fest.</p>
        </div>
      </section>

      {/* ---------- panggung ---------- */}
      <section className="section" id="panggung">
        <div className="wrap">
          <p className="chapter rv">Chapter 03 · Panggung</p>
          <h2 className="h2 rv">Tiga realm, tiga suasana</h2>
          <div className="realm-list">
            {stages.map((s, i) => (
              <article className="realm rv" key={s.name}>
                <div className="realm-img"><img src={s.img} alt={s.name} loading="lazy" /><span className="realm-no">0{i + 1}</span></div>
                <div className="realm-body">
                  <span className="tag">{s.tag}</span>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                  <small>{s.meta}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- tiket ---------- */}
      <section className="section" id="tiket">
        <div className="wrap">
          <p className="chapter rv">Chapter 04 · Tiket</p>
          <h2 className="h2 rv">Pilih peranmu</h2>
          <p className="lead rv">Harga presale. Naik 20% saat penjualan di gerbang.</p>
          <div className="tier-grid">
            {tiers.map((t) => (
              <article className={`tier rv ${t.hot ? 'hot' : ''}`} key={t.id}>
                {t.hot && <span className="tier-badge">Paling laris</span>}
                <h3>{t.name}</h3>
                <p className="tier-desc">{t.desc}</p>
                <p className="tier-price">{rupiah(t.price)}</p>
                <ul>{t.feats.map((f) => <li key={f}>{f}</li>)}</ul>
                <button className={`btn ${t.hot ? 'btn-glow' : 'btn-ghost'} btn-block`} onClick={() => openOrder(t)}>Pilih Tiket</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- venue ---------- */}
      <section className="venue">
        <div className="wrap venue-in">
          <div className="rv">
            <p className="chapter">Lokasi</p>
            <h2 className="h2">Ecopark Ancol, Jakarta</h2>
            <p className="lead">Gerbang dibuka pukul 15.00 tiap harinya. Penampilan utama mulai 19.00 sampai tengah malam.</p>
          </div>
          <ul className="venue-list rv">
            <li><b>19 Des</b><span>Hari 1 · Hoshizora Reia & Galdos Orchestra</span></li>
            <li><b>20 Des</b><span>Hari 2 · DJ Tsukuyomi & Mira Velvette</span></li>
          </ul>
        </div>
      </section>

      {/* ---------- faq ---------- */}
      <section className="section" id="faq">
        <div className="wrap narrow">
          <p className="chapter rv">Chapter 05 · FAQ</p>
          <h2 className="h2 rv">Yang sering ditanyakan</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className={`faq rv ${openFaq === i ? 'open' : ''}`} key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  {f.q}<span className="faq-x" />
                </button>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- final cta ---------- */}
      <section className="finale">
        <Stars list={FINALE_STARS} />
        <div className="wrap rv">
          <p className="chapter">Jangan sampai ketinggalan</p>
          <h2 className="h2">Gerbang menuju dunia lain<br />segera ditutup.</h2>
          <a href="#tiket" className="btn btn-glow btn-lg">Amankan Tiketmu</a>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="footer">
        <div className="wrap foot-in">
          <a href="#top" className="brand">
            <img src="/logo.png" alt="Logo RE:STAGE" className="brand-logo" />
            <span className="brand-name">RE:STAGE</span>
          </a>
          <nav className="foot-links">
            <a href="#lineup">Lineup</a><a href="#panggung">Panggung</a>
            <a href="#tiket">Tiket</a><a href="#faq">FAQ</a>
          </nav>
          <p>© 2026 RE:STAGE. Another World Music Festival.</p>
        </div>
      </footer>

      {/* ---------- order modal ---------- */}
      {order && (
        <div className="modal-veil" onClick={closeOrder}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-x" onClick={closeOrder} aria-label="Tutup">×</button>
            <p className="chapter">Pemesanan tiket</p>
            <h3>{order.name}</h3>
            <p className="modal-price">{rupiah(order.price)} <span>/ orang</span></p>
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Kurangi">−</button>
              <b>{qty}</b>
              <button onClick={() => setQty(Math.min(8, qty + 1))} aria-label="Tambah">+</button>
            </div>
            <div className="modal-total"><span>Total</span><b>{rupiah(order.price * qty)}</b></div>
            <button className="btn btn-glow btn-block" onClick={copyOrder}>{copied ? 'Detail tersalin!' : 'Salin Detail Pesanan'}</button>
            <p className="modal-note">Kirim detail pesanan ke WhatsApp panitia untuk pembayaran via transfer / e-wallet. Maksimal 8 tiket per transaksi.</p>
          </div>
        </div>
      )}
    </div>
  )
}
