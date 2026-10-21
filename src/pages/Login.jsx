import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail, ShieldCheck, UserRound, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, isFirebaseConfigured } from '../utils/firebase';

const authErrors = {
  'auth/email-already-in-use': 'Email ini sudah terdaftar. Coba masuk.',
  'auth/invalid-credential': 'Email atau kata sandi tidak sesuai.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/weak-password': 'Kata sandi minimal harus 6 karakter.',
  'auth/unauthorized-domain': 'Domain aplikasi belum diizinkan di pengaturan Firebase.',
};

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (user) => {
      if (user) navigate('/', { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!auth) return;
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/', { replace: true });
    } catch (authError) {
      setError(authErrors[authError.code] || 'Tidak dapat memproses akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden py-12 md:py-16">
      <div className="pointer-events-none absolute -left-40 top-12 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-accent/5 blur-[100px]" />

      <div className="container-main grid w-full items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div className="hidden lg:block">
          <Link to="/" className="mb-16 inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-text-primary">
            <ArrowLeft size={17} /> Kembali ke beranda
          </Link>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-accent">Forge your next level</p>
          <h1 className="max-w-xl text-6xl font-black leading-[1.05] tracking-tight xl:text-7xl">
            Latihan lebih fokus. <span className="text-accent">Progres</span> lebih nyata.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-text-secondary">
            Masuk untuk melanjutkan perjalanan latihan dan menyimpan progres kebugaranmu.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-text-secondary">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent"><ShieldCheck size={19} /></span>
            Data akun tersimpan dengan aman melalui Firebase Authentication.
          </div>
        </div>

        <div className="card mx-auto w-full max-w-lg p-6 sm:p-9">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary lg:hidden">
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-bg-primary"><Zap size={22} fill="currentColor" /></div>
            <div>
              <p className="font-heading text-xl font-black">FORGE<span className="text-accent">FITNESS</span></p>
              <p className="text-xs text-text-muted">Akun latihanmu dimulai di sini</p>
            </div>
          </div>

          <div className="mb-7">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{mode === 'login' ? 'Selamat datang kembali' : 'Mulai perjalananmu'}</p>
            <h2 className="text-3xl font-bold">{mode === 'login' ? 'Masuk ke akun' : 'Buat akun baru'}</h2>
            <p className="mt-2 text-sm text-text-secondary">{mode === 'login' ? 'Lanjutkan progres latihanmu hari ini.' : 'Daftar dan mulai bangun rutinitas yang konsisten.'}</p>
          </div>

          {!isFirebaseConfigured && (
            <div className="mb-5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm leading-6 text-warning">
              Login belum aktif. Lengkapi konfigurasi Firebase pada file <strong>.env</strong> dan aktifkan Email/Password di Firebase Console.
            </div>
          )}
          {error && <p role="alert" className="mb-5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <label className="block space-y-2 text-sm font-medium">
                Nama
                <span className="relative block">
                  <UserRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input className="input-field pl-11" type="text" autoComplete="name" placeholder="Nama kamu" value={name} onChange={(event) => setName(event.target.value)} required />
                </span>
              </label>
            )}
            <label className="block space-y-2 text-sm font-medium">
              Email
              <span className="relative block">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input className="input-field pl-11" type="email" autoComplete="email" placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </span>
            </label>
            <label className="block space-y-2 text-sm font-medium">
              Kata sandi
              <span className="relative block">
                <input className="input-field pr-12" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Minimal 6 karakter" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted hover:text-text-primary" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <button type="submit" disabled={loading || !isFirebaseConfigured} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat akun'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button type="button" onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login'); }} className="font-semibold text-accent hover:text-accent-hover">
              {mode === 'login' ? 'Daftar sekarang' : 'Masuk'}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}