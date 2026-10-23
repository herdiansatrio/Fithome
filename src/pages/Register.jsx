import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, isFirebaseConfigured } from '../utils/firebase';
import Logo from '../components/Logo';

const authErrors = {
  'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk menggunakan akunmu.',
  'auth/invalid-email': 'Format email tidak valid. Pastikan penulisan email benar.',
  'auth/weak-password': 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter kombinasi huruf dan angka.',
  'auth/network-request-failed': 'Gagal terhubung ke server. Periksa koneksi internetmu.',
  'auth/operation-not-allowed': 'Pendaftaran email belum diaktifkan di pengaturan sistem.',
};

const freeBenefits = [
  'Akses 50+ variasi gerakan calisthenics & panduan teknik form',
  '3 level program latihan terstruktur (Pemula, Menengah, Lanjutan)',
  'Kalkulator BMI, estimasi kalori harian, dan target berat badan',
  'Pencatatan riwayat sesi latihan & statistik konsistensi mandiri',
];

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Jika sudah login, langsung alihkan
  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (user) => {
      if (user) navigate(from, { replace: true });
    });
  }, [navigate, from]);

  // Hitung kekuatan kata sandi
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[a-zA-Z]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-error' };
    if (score <= 2) return { score: 2, label: 'Sedang', color: 'bg-warning' };
    return { score: 3, label: 'Kuat', color: 'bg-accent' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isFirebaseConfigured || !auth) {
      setError('Firebase belum dikonfigurasi. Hubungi administrator.');
      return;
    }

    if (!name.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
      return;
    }

    if (!agreeTerms) {
      setError('Kamu perlu menyetujui komitmen latihan untuk mendaftar.');
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Simpan nama pengguna ke profil Firebase
      if (name.trim()) {
        await updateProfile(credential.user, {
          displayName: name.trim(),
        });
      }
      navigate(from, { replace: true });
    } catch (authError) {
      setError(authErrors[authError.code] || authError.message || 'Gagal mendaftarkan akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden py-12 md:py-16">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-12 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-accent/5 blur-[110px]" />

      <div className="container-main grid w-full items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">

        {/* ── Sisi Kiri: Branding & Keuntungan Akun Gratis ── */}
        <div className="hidden lg:block">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={16} /> Kembali ke beranda
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 mb-5">
            <Sparkles size={14} className="text-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent font-semibold">
              100% Gratis Selamanya
            </span>
          </div>

          <h1 className="max-w-xl text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight">
            Mulai Transformasi <span className="text-accent text-glow">Fisikmu</span> Hari Ini.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary">
            Bergabunglah dengan ribuan pejuang kebugaran rumahan. Dapatkan akses ke program latihan, panduan form calisthenics, dan kalkulator kesehatan tanpa biaya.
          </p>

          {/* List Keuntungan */}
          <div className="mt-8 space-y-3.5 max-w-lg">
            {freeBenefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <CheckCircle2 size={13} />
                </div>
                <span className="text-sm text-text-secondary">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-xs text-text-muted">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-card text-accent">
              <ShieldCheck size={18} />
            </span>
            <span>Data akun terlindungi dengan enkripsi aman Firebase Authentication.</span>
          </div>
        </div>

        {/* ── Sisi Kanan: Form Pendaftaran Akun ── */}
        <div className="card mx-auto w-full max-w-lg p-6 sm:p-9 shadow-2xl border border-border/80">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary lg:hidden"
          >
            <ArrowLeft size={16} /> Kembali
          </Link>

          {/* Header Brand */}
          <div className="mb-6">
            <Logo size="lg" />
            <p className="text-xs text-text-muted mt-2">Pendaftaran Akun Pengguna Baru</p>
          </div>

          <div className="mb-6">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
              Langkah Pertama
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Buat Akun Baru
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-text-secondary">
              Isi data di bawah untuk membuka semua fitur dan program latihan.
            </p>
          </div>

          {/* Peringatan jika Firebase belum siap */}
          {!isFirebaseConfigured && (
            <div className="mb-5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-xs leading-relaxed text-warning">
              Konfigurasi Firebase belum lengkap di environment file. Hubungi administrator proyek.
            </div>
          )}

          {/* Pesan Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error animate-fade-in"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nama Lengkap */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  className="input-field pl-10"
                  type="text"
                  autoComplete="name"
                  placeholder="Masukkan nama lengkapmu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Alamat Email
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  className="input-field pl-10"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Kata Sandi */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Kata Sandi
                </label>
                {password && (
                  <span className="text-[11px] font-semibold text-text-muted">
                    Kekuatan: <span className="text-text-primary">{strength.label}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  className="input-field pl-10 pr-11"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted hover:text-text-primary transition-colors"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Password strength meter bar */}
              {password && (
                <div className="mt-2 flex gap-1.5">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength.score >= 1 ? strength.color : 'bg-border'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength.score >= 2 ? strength.color : 'bg-border'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength.score >= 3 ? strength.color : 'bg-border'}`} />
                </div>
              )}
            </div>

            {/* Input Konfirmasi Kata Sandi */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  className={`input-field pl-10 pr-11 ${
                    confirmPassword && confirmPassword !== password ? 'border-error focus:border-error focus:ring-error' : ''
                  }`}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted hover:text-text-primary transition-colors"
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="mt-1 text-[11px] text-error">Kata sandi belum cocok</p>
              )}
            </div>

            {/* Checkbox Ketentuan */}
            <label className="flex items-start gap-2.5 pt-1 text-xs text-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-border bg-bg-secondary text-accent focus:ring-accent"
              />
              <span>
                Saya berkomitmen untuk melatih disiplin diri dan mengikuti panduan latihan dengan aman.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFirebaseConfigured}
              className="btn-primary w-full justify-center py-3 text-sm font-semibold shadow-glow disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            >
              {loading ? 'Mendaftarkan akun...' : 'Daftar Akun Sekarang'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* Link ke Halaman Masuk */}
          <div className="mt-6 pt-5 border-t border-border/60 text-center text-sm text-text-secondary">
            Sudah memiliki akun?{' '}
            <Link
              to="/login"
              className="font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              Masuk di sini
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
