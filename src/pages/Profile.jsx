import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ArrowRight, Award, CalendarDays, Check, Clock3, Dumbbell, Flame, Mail, Pencil, Save, UserRound, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { readWorkoutHistory } from '../utils/workoutHistory';

function formatDuration(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes ? `${minutes} menit ${remainingSeconds} detik` : `${remainingSeconds} detik`;
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setDisplayName(currentUser?.displayName || '');
      setHistory(currentUser ? readWorkoutHistory(currentUser.uid) : []);
      setLoading(false);
    });
  }, []);

  const totals = useMemo(() => history.reduce((sum, workout) => ({
    sessions: sum.sessions + 1,
    minutes: sum.minutes + Math.floor((workout.durationSeconds || 0) / 60),
    calories: sum.calories + (workout.caloriesBurned || 0),
  }), { sessions: 0, minutes: 0, calories: 0 }), [history]);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!user) return;
    const nextName = displayName.trim();
    if (!nextName) {
      setError('Nama profil tidak boleh kosong.');
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProfile(user, { displayName: nextName });
      setUser({ ...user, displayName: nextName });
      setEditing(false);
      setMessage('Profil berhasil diperbarui.');
    } catch {
      setError('Profil belum dapat diperbarui. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="section"><div className="container-main"><p className="text-center text-text-secondary">Memuat profil...</p></div></div>;
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container-main max-w-xl">
          <div className="card p-8 text-center sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent"><UserRound size={26} /></div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">Profil Forge</p>
            <h1 className="text-3xl font-black">Masuk untuk melihat profil</h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">Informasi akun dan catatan latihan tersimpan pada profilmu. Masuk atau buat akun untuk melanjutkan.</p>
            <Link to="/login" className="btn-primary mt-6 justify-center">Masuk / Daftar <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    );
  }

  const joinedDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <section className="section">
      <div className="container-main max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-accent">Area anggota</p>
            <h1 className="text-4xl font-black sm:text-5xl">Profil <span className="text-accent">Saya</span></h1>
            <p className="mt-2 text-sm text-text-secondary">Kelola informasi akun dan lihat perjalanan latihanmu.</p>
          </div>
          <Link to="/program" className="btn-secondary self-start text-sm sm:self-auto">Jelajahi program <ArrowRight size={15} /></Link>
        </div>

        {message && <p role="status" className="mb-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{message}</p>}
        {error && <p role="alert" className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="card p-6 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-accent/25 bg-accent/10 text-2xl font-black text-accent">
                  {user.photoURL ? <img src={user.photoURL} alt="Foto profil" className="h-full w-full object-cover" /> : (user.displayName || user.email || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">{user.displayName || 'Atlet Forge'}</h2>
                  <p className="truncate text-sm text-text-secondary">{user.email}</p>
                </div>
              </div>
              {!editing && <button type="button" onClick={() => { setDisplayName(user.displayName || ''); setEditing(true); setMessage(''); setError(''); }} className="btn-ghost px-3 py-2 text-xs" aria-label="Edit profil"><Pencil size={14} /> Edit</button>}
            </div>

            {editing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <label className="block space-y-2 text-sm font-medium">Nama profil
                  <input className="input-field" type="text" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={60} autoComplete="name" required />
                </label>
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm disabled:opacity-50"><Save size={15} /> {saving ? 'Menyimpan...' : 'Simpan'}</button>
                  <button type="button" onClick={() => { setEditing(false); setDisplayName(user.displayName || ''); setError(''); }} className="btn-secondary justify-center text-sm"><X size={15} /> Batal</button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 border-t border-border pt-5">
                <div className="flex items-center gap-3 text-sm"><UserRound size={16} className="text-accent" /><span className="text-text-secondary">Nama</span><strong className="ml-auto text-right">{user.displayName || 'Belum diatur'}</strong></div>
                <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-accent" /><span className="text-text-secondary">Email</span><strong className="ml-auto max-w-[60%] truncate text-right">{user.email}</strong></div>
                <div className="flex items-center gap-3 text-sm"><CalendarDays size={16} className="text-accent" /><span className="text-text-secondary">Bergabung</span><strong className="ml-auto text-right">{joinedDate}</strong></div>
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Sesi selesai', value: totals.sessions, icon: Dumbbell },
              { label: 'Total menit', value: totals.minutes, icon: Clock3 },
              { label: 'Estimasi kalori', value: totals.calories, icon: Flame },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="card flex items-center gap-4 p-5 sm:flex-col sm:items-start sm:justify-center sm:gap-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon size={19} /></span>
                <div><p className="font-heading text-2xl font-black">{value.toLocaleString('id-ID')}</p><p className="text-xs text-text-secondary">{label}</p></div>
              </div>
            ))}
          </section>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Catatan aktivitas</p>
              <h2 className="text-2xl font-bold">Latihan yang sudah dilakukan</h2>
            </div>
            <span className="badge-neutral">{history.length} sesi</span>
          </div>
          {history.length === 0 ? (
            <div className="card px-6 py-12 text-center">
              <Award size={30} className="mx-auto mb-3 text-accent" />
              <p className="font-semibold">Belum ada sesi tersimpan</p>
              <p className="mt-1 text-sm text-text-secondary">Selesaikan sesi dari halaman program, lalu pilih “Simpan Sesi ke Riwayat”.</p>
              <Link to="/program" className="btn-primary mt-5 justify-center text-sm">Pilih program <ArrowRight size={15} /></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((workout) => (
                <article key={workout.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Check size={18} /></span>
                    <div>
                      <h3 className="font-heading font-bold">{workout.programName}</h3>
                      <p className="text-sm text-accent">{workout.dayLabel}</p>
                      <p className="mt-1 text-xs text-text-secondary">{workout.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 pl-[52px] text-xs text-text-secondary sm:pl-0">
                    <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-accent" />{formatDuration(workout.durationSeconds)}</span>
                    <span className="inline-flex items-center gap-1.5"><Flame size={14} className="text-accent" />~{workout.caloriesBurned} kkal</span>
                    <span className="inline-flex items-center gap-1.5"><Dumbbell size={14} className="text-accent" />{workout.completedSets}/{workout.totalSets} set</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
