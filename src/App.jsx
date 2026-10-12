import { useEffect, useRef, useState } from 'react'

/* ================= data ================= */

const EVENT_DATE = new Date('2026-12-19T16:00:00+07:00')
const FEE_RATE = 0.05
const MAX_QTY = 8

const tiers = [
  {
    id: 'festival', name: 'Festival Pass', phase: 'Presale 2',
    price: 350000, normal: 450000, left: 214,
    desc: 'Akses 2 hari ke semua panggung dan area festival.',
    feats: ['Semua panggung (3 realm)', 'Area festival & food court', 'E-ticket + wristband', 'Cosplay walk sore hari'],
    hot: false,
  },
  {
    id: 'vip', name: 'VIP Pass', phase: 'Presale 2',
    price: 800000, normal: 1000000, left: 87,
    desc: 'Posisi terbaik tanpa perlu datang pagi-pagi.',
    feats: ['Semua benefit Festival', 'Front zone Sanctuary Stage', 'Lounge & toilet prioritas', 'Merchandise eksklusif'],
    hot: true,
  },
  {
    id: 'vvip', name: 'VVIP Pass', phase: 'Presale 2',
    price: 1500000, normal: 1800000, left: 32,
    desc: 'Pengalaman paling lengkap, kuota sangat terbatas.',
    feats: ['Semua benefit VIP', 'Backstage tour + viewing deck', 'Meet & greet headliner', 'Jalur masuk khusus'],
    hot: false,
  },
]

const lineup = [
  { name: 'Hoshizora Reia', genre: 'Anison', role: 'Headliner · Hari 1', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop' },
  { name: 'DJ Tsukuyomi', genre: 'EDM / Hardstyle', role: 'Headliner · Hari 2', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
  { name: 'Sora & The Wanderers', genre: 'J-Pop Band', role: 'Sanctuary Stage', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop' },
  { name: 'Neon Kitsune', genre: 'City Pop / Vocaloid', role: "Witch's Hollow", img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
  { name: 'Galdos Orchestra', genre: 'Anime Orchestra', role: "Dragon's Roost", img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop' },
  { name: 'Mira Velvette', genre: 'Solo Ballad', role: 'Sanctuary Stage', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop' },
]

const rundown = [
  { day: 'Hari 1', date: 'Sabtu, 19 Desember 2026', items: [
    ['15.00', 'Open gate', 'Penukaran wristband & Cosplay Walk'],
    ['16.00', 'Galdos Orchestra', "Dragon's Roost"],
    ['18.30', 'Sora & The Wanderers', 'Sanctuary Stage'],
    ['20.00', 'Mira Velvette', 'Sanctuary Stage'],
    ['21.30', 'Hoshizora Reia', 'Headliner · Sanctuary Stage'],
  ]},
  { day: 'Hari 2', date: 'Minggu, 20 Desember 2026', items: [
    ['15.00', 'Open gate', 'Penukaran wristband & Cosplay Walk'],
    ['16.00', 'Neon Kitsune', "Witch's Hollow"],
    ['18.00', 'Galdos Orchestra', "Dragon's Roost"],
    ['20.00', 'Mira Velvette', 'Sanctuary Stage'],
    ['21.30', 'DJ Tsukuyomi', "Headliner · Witch's Hollow"],
  ]},
]

const faqs = [
  { q: 'Bagaimana cara menerima e-ticket?', a: 'E-ticket dikirim ke email kamu maksimal 10 menit setelah pembayaran terkonfirmasi. Tunjukkan QR-nya di gerbang untuk ditukar wristband.' },
  { q: 'Apakah nama di tiket harus sesuai KTP?', a: 'Ya. Nama pembeli dipakai saat penukaran wristband, jadi pastikan data yang diisi benar dan sesuai kartu identitas.' },
  { q: 'Apakah tiket bisa di-refund atau dijadwalkan ulang?', a: 'Tiket tidak bisa di-refund. Tapi kamu bisa mengalihkan ke orang lain maksimal H-3 acara lewat email konfirmasi.' },
  { q: 'Metode pembayaran apa saja yang tersedia?', a: 'QRIS, virtual account (BCA, BRI, Mandiri), e-wallet (GoPay, OVO, DANA), kartu kredit/debit, dan gerai retail (Alfamart, Indomaret).' },
  { q: 'Berapa maksimal pembelian per transaksi?', a: 'Maksimal 8 tiket per transaksi. Kalau butuh lebih, ulangi pemesanan dengan email yang sama.' },
  { q: 'Apakah boleh cosplay dan bawa kamera?', a: 'Cosplay sangat dianjurkan, ada Cosplay Walk tiap sore. Kamera HP boleh, kamera profesional dan drone tidak diizinkan.' },
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

const SPARKS = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  x: (i * 7919) % 100,
  y: (i * 4799) % 45,
  s: 3 + ((i * 37) % 5),
  d: 2.4 + ((i * 13) % 40) / 10,
}))

/* ================= app ================= */

export default function App() {
  const cd = useCountdown(EVENT_DATE)
  const [burger, setBurger] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [cart, setCart] = useState({ festival: 0, vip: 0, vvip: 0 })
  const [modal, setModal] = useState(null) // null | 'data' | 'pay' | 'processing' | 'done'
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
      setCode('RST-' + c)
      setModal('done')
    }, 1800)
  }
  const closeModal = () => {
    setModal(null)
    if (modal === 'done') { setCart({ festival: 0, vip: 0, vvip: 0 }); setPay('') }
  }

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
          <a href="#tiket" onClick={() => setBurger(false)}>Tiket</a>
          <a href="#rundown" onClick={() => setBurger(false)}>Rundown</a>
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
        <div className="sun" aria-hidden="true" />
        <div className="cloud c1" aria-hidden="true" />
        <div className="cloud c2" aria-hidden="true" />
        <div className="cloud c3" aria-hidden="true" />
        {SPARKS.map((s) => (
          <span key={s.id} className="spark" aria-hidden="true" style={{
            left: s.x + '%', top: s.y + '%', width: s.s, height: s.s, animationDuration: s.d + 's',
          }} />
        ))}
        <div className="hero-inner">
          <p className="eyebrow rv">Another World Music Festival · Vol. 4</p>
          <h1 className="hero-title rv">RE:STAGE</h1>
          <p className="hero-sub rv">Dua malam festival musik bertema isekai. Anison, J-pop, EDM, sampai orkestra, semua dalam satu dunia.</p>
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
            <a href="#tiket" className="btn btn-glow btn-lg">Beli Tiket Sekarang</a>
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
          <h2 className="h2 rv">Festival dua malam di <span className="ac">dunia lain</span></h2>
          <p className="lead rv">RE:STAGE mengubah Ecopark Ancol jadi kota fantasi. Tiga panggung, tata cahaya senja raksasa, dan 24 penampil dari Jepang sampai lokal. Beli tiketnya online, tukarkan wristband di gerbang, dan nikmati malamnya.</p>
          <div className="stats">
            {[['02', 'Hari penuh'], ['03', 'Panggung'], ['24', 'Penampil'], ['15rb+', 'Tiket terjual']].map(([n, l]) => (
              <div className="stat rv" key={l}><b>{n}</b><span>{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- lineup ---------- */}
      <section className="section alt" id="lineup">
        <div className="wrap">
          <p className="chapter rv">Chapter 02 · Lineup</p>
          <h2 className="h2 rv">Para bintang dari <span className="ac">dunia lain</span></h2>
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

      {/* ---------- tiket ---------- */}
      <section className="section" id="tiket">
        <div className="wrap">
          <p className="chapter rv">Chapter 03 · Tiket</p>
          <h2 className="h2 rv">Pilih <span className="ac">tiketmu</span></h2>
          <p className="lead rv">Presale 1 sudah habis. Sekarang masuk <b>Presale 2</b>, harga naik lagi saat fase Normal. Maksimal 8 tiket per transaksi.</p>
          <div className="tier-grid">
            {tiers.map((t) => {
              const q = cart[t.id] || 0
              return (
                <article className={`tier rv ${t.hot ? 'hot' : ''}`} key={t.id}>
                  {t.hot && <span className="tier-badge">Paling laris</span>}
                  <h3>{t.name}</h3>
                  <p className="tier-desc">{t.desc}</p>
                  <p className="tier-price"><span className="now">{rupiah(t.price)}</span><span className="was">{rupiah(t.normal)}</span></p>
                  <p className="tier-phase">{t.phase} · tersisa {t.left}</p>
                  <ul>{t.feats.map((f) => <li key={f}>{f}</li>)}</ul>
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
      <section className="section alt" id="rundown">
        <div className="wrap">
          <p className="chapter rv">Chapter 04 · Rundown</p>
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
            <li><b>3 Realm</b><span>Sanctuary Stage · Witch's Hollow · Dragon's Roost</span></li>
            <li><b>Food Court</b><span>40+ tenant kuliner Jepang & lokal</span></li>
            <li><b>Cosplay Area</b><span>Cosplay walk & lomba kostum tiap sore</span></li>
          </ul>
        </div>
      </section>

      {/* ---------- faq ---------- */}
      <section className="section" id="faq">
        <div className="wrap narrow">
          <p className="chapter rv">Chapter 05 · FAQ</p>
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
          <a href="#tiket" className="btn btn-glow btn-lg">Beli Tiket Sekarang</a>
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
            <a href="#lineup">Lineup</a><a href="#tiket">Tiket</a>
            <a href="#rundown">Rundown</a><a href="#faq">FAQ</a>
          </nav>
          <p>© 2026 RE:STAGE. Another World Music Festival.</p>
        </div>
      </footer>

      {/* ---------- sticky cart ---------- */}
      <div className={`cartbar ${totalQty > 0 && !modal ? 'show' : ''}`}>
        <div className="cb-info">
          <b>{totalQty} tiket · {rupiah(total)}</b>
          <span>termasuk biaya layanan 5%</span>
        </div>
        <button className="btn btn-glow" onClick={startCheckout}>Lanjut</button>
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
                  <button className="btn btn-glow" onClick={toPay}>Lanjut Bayar</button>
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
                  <button className="btn btn-glow" onClick={doPay} disabled={!pay}>Bayar {rupiah(total)}</button>
                </div>
              </>
            )}

            {modal === 'processing' && (
              <div className="success">
                <h3>Memproses pembayaran…</h3>
                <p className="sub">Jangan tutup halaman ini.</p>
                <button className="btn btn-glow" disabled><span className="spin" />Memproses</button>
              </div>
            )}

            {modal === 'done' && (
              <div className="success">
                <div className="ok">✓</div>
                <h3>Pembayaran berhasil!</h3>
                <div className="code">{code}</div>
                <p>E-ticket ({totalQty} tiket) dikirim ke <b>{buyer.email}</b>. Tunjukkan QR e-ticket di gerbang untuk ditukar wristband. Sampai jumpa di dunia lain!</p>
                <button className="btn btn-glow btn-block" onClick={closeModal}>Selesai</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
