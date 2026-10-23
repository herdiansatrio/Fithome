import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, Zap, BookOpen, Home as HomeIcon,
  Flame, Target, Sparkles, CheckCircle2, Calculator, Apple, Lock,
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import MuscleCategoryCard from '../components/MuscleCategoryCard';
import WorkoutCard from '../components/WorkoutCard';
import { muscleCategoryCards } from '../data/exercises';
import { programs } from '../data/programs';
import { useAuth } from '../context/AuthContext';

const stats = [
  { value: '50+', label: 'Panduan Gerakan', icon: BookOpen },
  { value: '3', label: 'Level Program Latihan', icon: Zap },
  { value: '100%', label: 'Bisa Dilakukan di Rumah', icon: HomeIcon },
];

const beginnerTips = [
  {
    step: '01',
    icon: Flame,
    title: 'Pemanasan Dinamis',
    description:
      'Luangkan 5–10 menit sebelum setiap sesi untuk mengaktifkan persendian dan otot, memompa sirkulasi darah serta meminimalkan risiko cedera.',
  },
  {
    step: '02',
    icon: Target,
    title: 'Kualitas di Atas Kuantitas',
    description:
      'Lakukan 8 repetisi dengan form yang terkontrol dan jangkauan penuh daripada 20 repetisi terburu-buru dengan teknik yang keliru.',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Pemulihan dan Konsistensi',
    description:
      'Jaringan otot beradaptasi dan berkembang saat istirahat. Jaga kualitas tidur 7–8 jam dan jadwalkan istirahat antar hari latihan secara disiplin.',
  },
];

// Preview data for locked sections
const kalkulatorFeatures = [
  { label: 'Kalkulator BMI', desc: 'Cek indeks massa tubuh & kategori berat badanmu' },
  { label: 'Estimasi Kalori', desc: 'Hitung kebutuhan kalori harian berdasarkan aktivitas' },
  { label: 'Target Berat Badan', desc: 'Rencanakan jalur mencapai berat badan ideal' },
];

const nutrisiFeatures = [
  { label: 'Database Makanan', desc: 'Cari kandungan gizi ratusan jenis makanan' },
  { label: 'Panduan Makro', desc: 'Rasio protein, karbohidrat, dan lemak yang ideal' },
  { label: 'Tips Pola Makan', desc: 'Rekomendasi diet sehat untuk mendukung latihanmu' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Navigasi sadar auth:
  // - Jika sudah login → ke halaman fitur
  // - Jika belum login → scroll ke section di landing page
  const handleNavOrScroll = (path, hash) => {
    if (user) {
      navigate(path);
    } else {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToLatihan = () => handleNavOrScroll('/latihan', 'latihan');
  const goToProgram = () => handleNavOrScroll('/program', 'program');

  return (
    <div>
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section
        id="beranda"
        className="relative min-h-[100dvh] flex items-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Background Image with Ambient Dark Vignette */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/90 to-bg-primary/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/70" />
        </div>

        {/* Noise overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Ambient accent glow */}
        <div
          className="absolute top-1/4 left-1/3 w-[32rem] h-[32rem] rounded-full opacity-15 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #A3E635, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="container-main relative z-10 py-24 md:py-36">
          <div className="max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-accent text-xs font-heading font-semibold uppercase tracking-widest">
                Latihan Mandiri Tanpa Gym
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight mb-5 animate-slide-up">
              BANGUN KEKUATAN.
              <br />
              <span className="text-accent text-glow">DI MANA SAJA.</span>
              <br />
              MULAI HARI INI.
            </h1>

            {/* Subheadline */}
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-xl animate-slide-up animation-delay-100">
              Panduan latihan berat tubuh dan program workout terstruktur untuk membangun fisik prima, fleksibilitas, dan kebiasaan sehat langsung dari rumah.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-slide-up animation-delay-200">
              <button
                onClick={goToLatihan}
                className="btn-primary shadow-glow text-base px-8 py-3.5"
              >
                Mulai Latihan <ArrowRight size={18} />
              </button>
              <button
                onClick={goToProgram}
                className="btn-secondary text-base px-8 py-3.5"
              >
                Jelajahi Program
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float opacity-70">
          <span className="text-text-muted text-[11px] uppercase tracking-wider font-semibold">Scroll</span>
          <ChevronDown size={14} className="text-text-secondary" />
        </div>
      </section>

      {/* ── STATS SECTION ─────────────────────────────────── */}
      <section className="py-10 bg-bg-secondary/70 border-y border-border backdrop-blur-sm" aria-label="Statistik">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center p-4 rounded-2xl bg-bg-card/50 border border-border/40">
                <Icon size={20} className="text-accent mx-auto mb-2 opacity-90" aria-hidden="true" />
                <p className="font-heading font-black text-3xl md:text-4xl text-text-primary tracking-tight tabular-nums mb-1">
                  {value}
                </p>
                <p className="text-text-secondary text-xs md:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MUSCLE CATEGORIES ─────────────────────────────── */}
      <section id="latihan" className="section" aria-labelledby="categories-heading">
        <div className="container-main">
          <SectionHeading
            label="Katalog Target"
            title={<>Latihan untuk <span className="text-accent">Setiap Otot</span></>}
            subtitle="Pilih kelompok otot yang ingin kamu latih dan pelajari teknik form yang benar."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {muscleCategoryCards.map((category) => (
              <MuscleCategoryCard key={category.id} category={category} />
            ))}
          </div>
          {!user && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-sm px-6 py-2.5 shadow-glow"
              >
                Daftar Gratis untuk Akses Penuh <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary text-sm px-5 py-2.5"
              >
                Masuk
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PROGRAMS ──────────────────────────────── */}
      <section id="program" className="section bg-bg-secondary/40 border-y border-border/40" aria-labelledby="programs-heading">
        <div className="container-main">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <SectionHeading
              label="Program Workout"
              title={<>Program Latihan <span className="text-accent">Terstruktur</span></>}
              subtitle="Tiga jadwal program dengan timer sesi dan pencatatan repetisi yang siap diikuti."
              className="mb-0"
            />
            {user && (
              <button
                onClick={() => navigate('/program')}
                className="btn-ghost hidden md:flex text-accent hover:text-accent font-semibold text-sm"
              >
                Lihat Semua <ArrowRight size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program) => (
              <WorkoutCard key={program.id} program={program} />
            ))}
          </div>

          {!user && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-sm px-6 py-2.5 shadow-glow"
              >
                Daftar Akun & Mulai Latihan <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary text-sm px-5 py-2.5"
              >
                Masuk
              </button>
            </div>
          )}
          {user && (
            <div className="mt-8 md:hidden text-center">
              <button onClick={() => navigate('/program')} className="btn-secondary w-full justify-center text-sm py-3">
                Lihat Semua Program <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── KALKULATOR PREVIEW ──────────────────────────────── */}
      <section id="kalkulator" className="section" aria-labelledby="kalkulator-heading">
        <div className="container-main">
          <SectionHeading
            label="Tools Kebugaran"
            title={<>Kalkulator <span className="text-accent">Kesehatan</span></>}
            subtitle="Hitung BMI, estimasi kalori harian, dan rencanakan target berat badanmu secara akurat."
            centered
          />

          <div className="relative max-w-4xl mx-auto">
            {/* Preview cards */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ${!user ? 'blur-[2px] select-none pointer-events-none' : ''}`}>
              {kalkulatorFeatures.map(({ label, desc }) => (
                <div key={label} className="card p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Calculator size={18} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-text-primary">{label}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                  <div className="mt-auto pt-3 border-t border-border/50">
                    <span className="text-xs text-accent font-semibold">Fitur Eksklusif</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lock overlay for non-logged in users */}
            {!user && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-card border border-border shadow-xl">
                  <Lock size={24} className="text-accent" />
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-text-primary mb-1">Fitur Terkunci</p>
                  <p className="text-text-secondary text-sm mb-4">Login untuk mengakses kalkulator kesehatan</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => navigate('/register')}
                      className="btn-primary text-sm px-5 py-2.5 shadow-glow"
                    >
                      Daftar Akun Gratis <ArrowRight size={15} />
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-secondary text-sm px-4 py-2.5"
                    >
                      Masuk
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {user && (
            <div className="mt-8 text-center">
              <button onClick={() => navigate('/kalkulator')} className="btn-primary text-sm px-6 py-2.5">
                Buka Kalkulator <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── NUTRISI PREVIEW ──────────────────────────────── */}
      <section id="nutrisi" className="section bg-bg-secondary/40 border-y border-border/40" aria-labelledby="nutrisi-heading">
        <div className="container-main">
          <SectionHeading
            label="Panduan Nutrisi"
            title={<>Nutrisi untuk <span className="text-accent">Performa Optimal</span></>}
            subtitle="Pahami kebutuhan gizi harian dan temukan pola makan yang mendukung target kebugaranmu."
            centered
          />

          <div className="relative max-w-4xl mx-auto">
            {/* Preview cards */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ${!user ? 'blur-[2px] select-none pointer-events-none' : ''}`}>
              {nutrisiFeatures.map(({ label, desc }) => (
                <div key={label} className="card p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Apple size={18} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-text-primary">{label}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                  <div className="mt-auto pt-3 border-t border-border/50">
                    <span className="text-xs text-accent font-semibold">Fitur Eksklusif</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lock overlay for non-logged in users */}
            {!user && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-card border border-border shadow-xl">
                  <Lock size={24} className="text-accent" />
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-text-primary mb-1">Fitur Terkunci</p>
                  <p className="text-text-secondary text-sm mb-4">Login untuk mengakses panduan nutrisi</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => navigate('/register')}
                      className="btn-primary text-sm px-5 py-2.5 shadow-glow"
                    >
                      Daftar Akun Gratis <ArrowRight size={15} />
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-secondary text-sm px-4 py-2.5"
                    >
                      Masuk
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {user && (
            <div className="mt-8 text-center">
              <button onClick={() => navigate('/nutrisi')} className="btn-primary text-sm px-6 py-2.5">
                Buka Panduan Nutrisi <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── BEGINNER PRINCIPLES ─────────────────────────────────── */}
      <section className="section" aria-labelledby="tips-heading">
        <div className="container-main">
          <SectionHeading
            label="Prinsip Fondasi"
            title={<>Panduan untuk <span className="text-accent">Hasil Maksimal</span></>}
            subtitle="Tiga pilar dasar yang menjamin progres kebugaran aman, konsisten, dan berkelanjutan."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {beginnerTips.map(({ step, icon: Icon, title, description }) => (
              <div
                key={title}
                className="card p-6 md:p-8 flex flex-col justify-between hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono font-bold text-accent text-sm tracking-wider">
                      {step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text-primary mb-3">
                    {title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-1.5 text-xs text-text-muted">
                  <CheckCircle2 size={13} className="text-accent" /> Fondasi Esensial
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────── */}
      <section className="section py-16 md:py-24" aria-label="Mulai Sekarang">
        <div className="container-main">
          <div className="relative rounded-3xl bg-gradient-to-b from-bg-card via-bg-secondary to-bg-card border border-border p-8 md:p-16 text-center overflow-hidden shadow-2xl">
            {/* Ambient Spotlight */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full opacity-20 blur-[100px] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #A3E635, transparent 65%)' }}
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="badge-accent text-xs font-semibold mb-4 inline-block">
                Akses Gratis Selamanya
              </span>
              <h2 className="font-heading font-black text-3xl md:text-5xl text-text-primary tracking-tight mb-4">
                Siap Memulai Transformasi Fisikmu?
              </h2>
              <p className="text-text-secondary text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                Tidak perlu keanggotaan gym mahal atau peralatan rumit. Cukup tekad, konsistensi, dan panduan latihan yang tepat.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={goToLatihan}
                  className="btn-primary text-base px-8 py-3.5 shadow-glow"
                >
                  Mulai Latihan Sekarang <ArrowRight size={18} />
                </button>
                <button
                  onClick={goToProgram}
                  className="btn-secondary text-base px-8 py-3.5"
                >
                  Pilih Program
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
