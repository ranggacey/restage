import { useEffect, useRef, useState } from 'react'

/* ================= ikon custom ================= */

const Icon = ({ d, size = 20, fill = false, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d={d} />
  </svg>
)
const I = {
  bolt: (s, p) => <Icon size={s} fill d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" {...p} />,
  ticket: (s, p) => <Icon size={s} d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z M13 6v12" {...p} />,
  pick: (s, p) => <Icon size={s} d="M12 3c3.5 0 8 4.5 8 9 0 4-3.5 8-8 9-4.5-1-8-5-8-9 0-4.5 4.5-9 8-9z M12 8v6" {...p} />,
  speaker: (s, p) => <Icon size={s} d="M4 4h16v16H4z M12 15.5a2.5 2.5 0 1 0 0 .01 M12 8.5a1.5 1.5 0 1 0 0 .01" {...p} />,
  mic: (s, p) => <Icon size={s} d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z M6 11a6 6 0 0 0 12 0 M12 17v4" {...p} />,
  drum: (s, p) => <Icon size={s} d="M3 13h18 M5 13l-2 7h18l-2-7 M12 13V6 M9 6l6 4 M15 6l-6 4" {...p} />,
  check: (s, p) => <Icon size={s} d="M4 12.5 9.5 18 20 6.5" {...p} />,
}

/* ================= data ================= */

const EVENT_DATE = new Date('2026-12-19T16:00:00+07:00')
const FEE_RATE = 0.05
const MAX_QTY = 8

const tiers = [
  {
    id: 'reguler', name: 'Reguler', phase: 'Presale 2', icon: 'ticket',
    price: 350000, normal: 450000, left: 214,
    desc: 'Buat yang mau seru-seruan bareng tanpa ribet.',
    feats: ['Akses 2 hari semua panggung', 'Festival area & food court', 'E-ticket + wristband', 'Free sticker pack'],
  },
  {
    id: 'vip', name: 'VIP', phase: 'Presale 2', icon: 'bolt',
    price: 800000, normal: 1000000, left: 87, hot: true,
    desc: 'Posisi paling depan, nonton paling puas.',
    feats: ['Semua benefit Reguler', 'Front zone Panggung Gelora', 'Lounge & toilet prioritas', 'Merchandise eksklusif'],
  },
  {
    id: 'vvip', name: 'VVIP', phase: 'Presale 2', icon: 'mic',
    price: 1500000, normal: 1800000, left: 32,
    desc: 'Pengalaman paling lengkap, kuota terbatas.',
    feats: ['Semua benefit VIP', 'Meet & greet headliner', 'Viewing deck + backstage tour', 'Jalur masuk khusus'],
  },
]

const lineup = [
  { name: 'Tulus', genre: 'Pop / Soul', role: 'Headliner · Hari 1', img: '/artists/tulus.jpg' },
  { name: 'Bernadya', genre: 'Pop Ballad', role: 'Headliner · Hari 2', img: '/artists/bernadya.jpg' },
  { name: 'Perunggu', genre: 'Pop Punk', role: 'Panggung Distorsi', img: '/artists/perunggu.jpg' },
  { name: 'Hindia', genre: 'Alternative', role: 'Panggung Gelora', img: '/artists/hindia.jpg' },
  { name: 'Pee Wee Gaskins', genre: 'Pop Punk', role: 'Panggung Distorsi', img: '/artists/pwg.jpg' },
  { name: 'Nadin Amizah', genre: 'Folk Pop', role: 'Panggung Senja', img: '/artists/nadin.jpg' },
]

const stages = [
  { name: 'Panggung Gelora', tag: 'Main Stage', icon: 'speaker',
    desc: 'Panggung terbesar. Headliner Tulus dan Bernadya tampil di sini, dengan tata cahaya dan LED raksasa.',
    meta: 'Kapasitas 10.000 · Open gate 15.00' },
  { name: 'Panggung Distorsi', tag: 'Pop Punk', icon: 'pick',
    desc: 'Sarangnya anak pop punk. Perunggu, Pee Wee Gaskins, dan band-band distorsi lain sampai malam.',
    meta: 'Moshpit aman · Sampai 23.00' },
  { name: 'Panggung Senja', tag: 'Akustik', icon: 'mic',
    desc: 'Sesi akustik intim di bawah langit senja. Duduk lesehan, sing along pelan-pelan.',
    meta: 'Kapasitas 1.500 · Duduk santai' },
]

const rundown = [
  { day: 'Hari 1', date: 'Sabtu, 19 Desember 2026', items: [
    ['15.00', 'Open gate', 'Penukaran wristband'],
    ['16.00', 'Nadin Amizah', 'Panggung Senja'],
    ['17.30', 'Hindia', 'Panggung Gelora'],
    ['19.00', 'Perunggu', 'Panggung Distorsi'],
    ['20.30', 'Pee Wee Gaskins', 'Panggung Distorsi'],
    ['21.30', 'Tulus', 'Headliner · Panggung Gelora'],
  ]},
  { day: 'Hari 2', date: 'Minggu, 20 Desember 2026', items: [
    ['15.00', 'Open gate', 'Penukaran wristband'],
    ['16.00', 'Perunggu', 'Panggung Distorsi'],
    ['17.30', 'Pee Wee Gaskins', 'Panggung Distorsi'],
    ['19.00', 'Nadin Amizah', 'Panggung Senja'],
    ['20.00', 'Hindia', 'Panggung Gelora'],
    ['21.30', 'Bernadya', 'Headliner · Panggung Gelora'],
  ]},
]

const faqs = [
  { q: 'Bagaimana cara menerima e-ticket?', a: 'E-ticket dikirim ke email kamu maksimal 10 menit setelah pembayaran terkonfirmasi. Tunjukkan QR-nya di gerbang untuk ditukar wristband.' },
  { q: 'Apakah nama di tiket harus sesuai KTP?', a: 'Ya. Nama pembeli dipakai saat penukaran wristband, jadi pastikan data yang diisi benar dan sesuai kartu identitas.' },
  { q: 'Apakah tiket bisa di-refund?', a: 'Tiket tidak bisa di-refund, tapi bisa dialihkan ke orang lain maksimal H-3 acara lewat email konfirmasi.' },
  { q: 'Metode pembayaran apa saja yang tersedia?', a: 'QRIS, virtual account (BCA, BRI, Mandiri), e-wallet (GoPay, OVO, DANA), kartu kredit/debit, dan gerai retail (Alfamart, Indomaret).' },
  { q: 'Berapa maksimal pembelian per transaksi?', a: 'Maksimal 8 tiket per transaksi. Kalau butuh lebih, ulangi pemesanan dengan email yang sama.' },
  { q: 'Boleh bawa banner dan kamera?', a: 'Banner ukuran kecil boleh, asal tidak menutupi penonton lain. Kamera HP boleh, kamera profesional dan drone tidak diizinkan.' },
]

const payMethods = [
  { id: 'qris', name: 'QRIS', desc: 'Semua e-wallet & m-banking' },
  { id: 'va', name: 'Virtual Account', desc: 'BCA · BRI · Mandiri' },
  { id: 'ewallet', name: 'E-Wallet', desc: 'GoPay · OVO · DANA' },
  { id: 'cc', name: 'Kartu Kredit / Debit', desc: 'Visa · Mastercard · JCB' },
  { id: 'retail', name: 'Gerai Retail', desc: 'Alfamart · Indomaret' },
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

function useReveal(dep) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.1 }
    )
    el.querySelectorAll('.rv').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [dep])
  return ref
}

/* ================= app ================= */

export default function App() {
  const cd = useCountdown(EVENT_DATE)
  const [burger, setBurger] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [cart, setCart] = useState({ reguler: 0, vip: 0, vvip: 0 })
  const [modal, setModal] = useState(null)
  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [pay, setPay] = useState('')
  const [code, setCode] = useState('')
  const root = useReveal(modal)

  useEffect(() => {
    const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modal])

  const setQty = (id, q) => setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(MAX_QTY, q)) }))
  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0)
  const subtotal = tiers.reduce((a, t) => a + t.price * (cart[t.id] || 0), 0)
  const fee = Math.round(subtotal * FEE_RATE)
  const total = subtotal + fee
  const pad = (v) => String(v).padStart(2, '0')

  const validateBuyer = () => {
    const e = {}
    if (buyer.name.trim().length < 3) e.name = 'Isi nama lengkap sesuai KTP.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim())) e.email = 'Format email tidak valid.'
    if (buyer.phone.replace(/\D/g, '').length < 9) e.phone = 'Nomor WhatsApp tidak valid.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const startCheckout = () => { setModal('data'); setErrors({}) }
  const toPay = () => { if (validateBuyer()) setModal('pay') }
  const doPay = () => {
    if (!pay) return
    setModal('processing')
    setTimeout(() => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let c = ''
      for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)]
      setCode('LUNAR-' + c)
      setModal('done')
    }, 1800)
  }
  const closeModal = () => {
    setModal(null)
    if (modal === 'done') { setCart({ reguler: 0, vip: 0, vvip: 0 }); setPay('') }
  }

  return (
    <div ref={root} className="page">
      {/* ---------- nav ---------- */}
      <header className="nav">
        <a href="#top" className="brand">
          <img src="/logo.png" alt="Logo LUNAR MUSIC" className="brand-logo" />
          <span className="brand-name">LUNAR MUSIC</span>
        </a>
        <nav className={`nav-links ${burger ? 'open' : ''}`}>
          <a href="#lineup" onClick={() => setBurger(false)}>Lineup</a>
          <a href="#tiket" onClick={() => setBurger(false)}>Tiket</a>
          <a href="#rundown" onClick={() => setBurger(false)}>Rundown</a>
          <a href="#faq" onClick={() => setBurger(false)}>FAQ</a>
        </nav>
        <div className="nav-cta">
          <a href="#tiket" className="btn btn-fire">Beli Tiket</a>
          <button className="burger" onClick={() => setBurger(!burger)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="hero" id="top">
        <div className="sky" aria-hidden="true" />
        <div className="halftone" aria-hidden="true" />
        <div className="moon" aria-hidden="true" />
        <div className="sticker s1 rv" aria-hidden="true">100%<br />LOKAL</div>
        <div className="sticker s2 rv" aria-hidden="true">2 HARI<br />PENUH</div>
        <div className="hero-inner">
          <p className="eyebrow rv">{I.bolt(14)} Festival Pop & Pop Punk Indonesia · Vol. 1</p>
          <h1 className="hero-title rv">LUNAR<br />MUSIC</h1>
          <p className="hero-sub rv">Dua hari penuh distorsi dan sing along. Tulus, Bernadya, Perunggu, Hindia, Pee Wee Gaskins, Nadin Amizah, satu panggung di bawah rembulan.</p>
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
            <a href="#tiket" className="btn btn-fire btn-lg">Beli Tiket Sekarang</a>
            <a href="#lineup" className="btn btn-ghost btn-lg">Lihat Lineup</a>
          </div>
        </div>
        <a href="#tentang" className="scroll-hint" aria-label="Gulir ke bawah"><span /></a>
      </section>

      {/* ---------- marquee ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array(2).fill('POP PUNK ✦ POP ✦ ALTERNATIVE ✦ INDIE ROCK ✦ FOLK POP ✦ SOUL ✦ ').map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ---------- tentang ---------- */}
      <section className="section" id="tentang">
        <div className="wrap">
          <p className="chapter rv">{I.bolt(14)} Chapter 01 · Tentang</p>
          <h2 className="h2 rv">Pesta musik <span className="ac">Indonesia</span>,<br />dari pop sampai pop punk.</h2>
          <p className="lead rv">LUNAR MUSIC ngumpulin musisi Indonesia lintas generasi dalam dua hari. Dari sing along bareng Tulus sampai moshing bareng Perunggu, semua ada di sini.</p>
          <div className="stats">
            {[['02', 'Hari penuh', 'ticket'], ['03', 'Panggung', 'speaker'], ['24', 'Penampil', 'mic'], ['15rb+', 'Tiket terjual', 'bolt']].map(([n, l, ic]) => (
              <div className="stat rv" key={l}><span className="stat-ic">{I[ic](22)}</span><b>{n}</b><span>{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- lineup ---------- */}
      <section className="section alt" id="lineup">
        <div className="wrap">
          <p className="chapter rv">{I.mic(14)} Chapter 02 · Lineup</p>
          <h2 className="h2 rv">Lineup <span className="ac">lokal</span> pilihan</h2>
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
          <p className="note rv">+ 18 penampil lain diumumkan bertahap. Pantau Instagram @lunar.music.</p>
        </div>
      </section>

      {/* ---------- panggung ---------- */}
      <section className="section" id="panggung">
        <div className="wrap">
          <p className="chapter rv">{I.speaker(14)} Chapter 03 · Panggung</p>
          <h2 className="h2 rv">Tiga panggung, <span className="ac">tiga energi</span></h2>
          <div className="stage-grid">
            {stages.map((s) => (
              <article className="stage rv" key={s.name}>
                <span className="stage-ic">{I[s.icon](30)}</span>
                <span className="tag">{s.tag}</span>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <small>{s.meta}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- tiket ---------- */}
      <section className="section alt" id="tiket">
        <div className="wrap">
          <p className="chapter rv">{I.ticket(14)} Chapter 04 · Tiket</p>
          <h2 className="h2 rv">Pilih <span className="ac">tiketmu</span></h2>
          <p className="lead rv">Presale 1 sudah habis. Sekarang masuk <b>Presale 2</b>, harga naik lagi saat fase Normal. Maksimal 8 tiket per transaksi.</p>
          <div className="tier-grid">
            {tiers.map((t) => {
              const q = cart[t.id] || 0
              return (
                <article className={`tier rv ${t.hot ? 'hot' : ''}`} key={t.id}>
                  {t.hot && <span className="tier-badge">Paling laris</span>}
                  <span className="tier-ic">{I[t.icon](28)}</span>
                  <h3>{t.name}</h3>
                  <p className="tier-desc">{t.desc}</p>
                  <p className="tier-price"><span className="now">{rupiah(t.price)}</span><span className="was">{rupiah(t.normal)}</span></p>
                  <p className="tier-phase">{t.phase} · tersisa {t.left}</p>
                  <ul>{t.feats.map((f) => <li key={f}>{I.check(15)}<span>{f}</span></li>)}</ul>
                  <div className="qty-row">
                    <div className="qty-ctl">
                      <button onClick={() => setQty(t.id, q - 1)} disabled={q === 0} aria-label={`Kurangi ${t.name}`}>−</button>
                      <b>{q}</b>
                      <button onClick={() => setQty(t.id, q + 1)} disabled={q >= MAX_QTY} aria-label={`Tambah ${t.name}`}>+</button>
                    </div>
                    <span className="qty-sub">{q > 0 ? rupiah(t.price * q) : '—'}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- rundown ---------- */}
      <section className="section" id="rundown">
        <div className="wrap">
          <p className="chapter rv">{I.drum(14)} Chapter 05 · Rundown</p>
          <h2 className="h2 rv">Jadwal <span className="ac">acara</span></h2>
          <div className="days">
            {rundown.map((d) => (
              <div className="day rv" key={d.day}>
                <h3>{d.day}</h3>
                <p>{d.date}</p>
                <ul className="rd">
                  {d.items.map(([time, act, place]) => (
                    <li key={time + act}><b>{time}</b><span>{act}<i>{place}</i></span></li>
                  ))}
                </ul>
              </div>
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
            <p className="lead">Gerbang dibuka pukul 15.00 tiap harinya. Tukar e-ticket dengan wristband di pintu masuk sesuai tier. Parkir tersedia di area P2 Ancol.</p>
          </div>
          <ul className="venue-list rv">
            <li><span className="v-ic">{I.speaker(20)}</span><div><b>3 Panggung</b><span>Gelora · Distorsi · Senja</span></div></li>
            <li><span className="v-ic">{I.ticket(20)}</span><div><b>Food Court</b><span>40+ tenant kuliner lokal</span></div></li>
            <li><span className="v-ic">{I.pick(20)}</span><div><b>Merch Area</b><span>Official merchandise semua penampil</span></div></li>
          </ul>
        </div>
      </section>

      {/* ---------- faq ---------- */}
      <section className="section" id="faq">
        <div className="wrap narrow">
          <p className="chapter rv">{I.bolt(14)} Chapter 06 · FAQ</p>
          <h2 className="h2 rv">Yang sering <span className="ac">ditanyakan</span></h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className={`faq rv ${openFaq === i ? 'open' : ''}`} key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  {f.q}<span className="faq-x" />
                </button>
                <div className="a"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- finale ---------- */}
      <section className="finale">
        <div className="wrap rv">
          <p className="chapter">Jangan sampai ketinggalan</p>
          <h2 className="h2">Presale 2 segera <span className="ac">habis</span>.<br />Amankan kursimu.</h2>
          <a href="#tiket" className="btn btn-fire btn-lg">Beli Tiket Sekarang</a>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="footer">
        <div className="wrap foot-in">
          <a href="#top" className="brand">
            <img src="/logo.png" alt="Logo LUNAR MUSIC" className="brand-logo" />
            <span className="brand-name">LUNAR MUSIC</span>
          </a>
          <nav className="foot-links">
            <a href="#lineup">Lineup</a><a href="#tiket">Tiket</a>
            <a href="#rundown">Rundown</a><a href="#faq">FAQ</a>
          </nav>
          <p>© 2026 LUNAR MUSIC. Festival Pop & Pop Punk Indonesia.</p>
        </div>
      </footer>

      {/* ---------- sticky cart ---------- */}
      <div className={`cartbar ${totalQty > 0 && !modal ? 'show' : ''}`}>
        <div className="cb-info">
          <b>{totalQty} tiket · {rupiah(total)}</b>
          <span>termasuk biaya layanan 5%</span>
        </div>
        <button className="btn btn-fire" onClick={startCheckout}>Lanjut</button>
      </div>

      {/* ---------- checkout modal ---------- */}
      {modal && (
        <div className="modal-veil" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-x" onClick={closeModal} aria-label="Tutup">×</button>

            {modal !== 'done' && (
              <div className="steps" aria-hidden="true">
                <i className={modal === 'data' || modal === 'pay' || modal === 'processing' ? 'on' : ''} />
                <i className={modal === 'pay' || modal === 'processing' ? 'on' : ''} />
                <i className={modal === 'processing' ? 'on' : ''} />
              </div>
            )}

            {modal === 'data' && (
              <>
                <h3>Data pembeli</h3>
                <p className="sub">Nama dipakai untuk penukaran wristband, jadi isi sesuai KTP.</p>
                <div className="sum">
                  {tiers.filter((t) => cart[t.id] > 0).map((t) => (
                    <div className="sum-row" key={t.id}>
                      <span>{t.name} × {cart[t.id]}</span><span>{rupiah(t.price * cart[t.id])}</span>
                    </div>
                  ))}
                  <div className="sum-row"><span>Biaya layanan (5%)</span><span>{rupiah(fee)}</span></div>
                  <div className="sum-row total"><span>Total</span><b>{rupiah(total)}</b></div>
                </div>
                <div className="field">
                  <label htmlFor="f-name">Nama lengkap</label>
                  <input id="f-name" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} placeholder="Sesuai KTP" />
                  {errors.name && <p className="err">{errors.name}</p>}
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email</label>
                  <input id="f-email" type="email" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} placeholder="E-ticket dikirim ke sini" />
                  {errors.email && <p className="err">{errors.email}</p>}
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Nomor WhatsApp</label>
                  <input id="f-phone" inputMode="tel" value={buyer.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} placeholder="08xx xxxx xxxx" />
                  {errors.phone && <p className="err">{errors.phone}</p>}
                </div>
                <div className="modal-nav">
                  <button className="btn btn-ghost" onClick={closeModal}>Batal</button>
                  <button className="btn btn-fire" onClick={toPay}>Lanjut Bayar</button>
                </div>
              </>
            )}

            {modal === 'pay' && (
              <>
                <h3>Metode pembayaran</h3>
                <p className="sub">Total yang dibayar <b>{rupiah(total)}</b> (sudah termasuk biaya layanan).</p>
                <div className="pay-list">
                  {payMethods.map((m) => (
                    <div key={m.id} className={`pay-opt ${pay === m.id ? 'on' : ''}`} onClick={() => setPay(m.id)} role="radio" aria-checked={pay === m.id} tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setPay(m.id)}>
                      <span className="radio" />
                      <div><b>{m.name}</b><small>{m.desc}</small></div>
                    </div>
                  ))}
                </div>
                <div className="modal-nav" style={{ marginTop: 18 }}>
                  <button className="btn btn-ghost" onClick={() => setModal('data')}>Kembali</button>
                  <button className="btn btn-fire" onClick={doPay} disabled={!pay}>Bayar {rupiah(total)}</button>
                </div>
              </>
            )}

            {modal === 'processing' && (
              <div className="success">
                <h3>Memproses pembayaran…</h3>
                <p className="sub">Jangan tutup halaman ini.</p>
                <button className="btn btn-fire" disabled><span className="spin" />Memproses</button>
              </div>
            )}

            {modal === 'done' && (
              <div className="success">
                <div className="ok">{I.check(38)}</div>
                <h3>Pembayaran berhasil!</h3>
                <div className="code">{code}</div>
                <p>E-ticket ({totalQty} tiket) dikirim ke <b>{buyer.email}</b>. Tunjukkan QR e-ticket di gerbang untuk ditukar wristband. Sampai jumpa di bawah rembulan!</p>
                <button className="btn btn-fire btn-block" onClick={closeModal}>Selesai</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
