import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import SectionHeading from '../components/SectionHeading';
import WorkoutCard from '../components/WorkoutCard';
import { programs } from '../data/programs';
import { Dumbbell, Target, Users, Play, History, Flame, Clock, Sparkles } from 'lucide-react';
import { auth } from '../utils/firebase';
import { readWorkoutHistory } from '../utils/workoutHistory';

const highlights = [
  { icon: Dumbbell, title: 'Latihan Terstruktur', desc: 'Jadwal dan susunan gerakan bertahap terencana.' },
  { icon: Target, title: 'Target Spesifik', desc: 'Sesuai tujuan: kekuatan dasar, hipertrofi, atau fat-loss.' },
  { icon: Users, title: 'Pelacakan Set & Waktu', desc: 'Stopwatch sesi & timer istirahat interaktif tersimpan otomatis.' },
];

export default function Programs() {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [activeProgramStats, setActiveProgramStats] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [user, setUser] = useState(auth?.currentUser ?? null);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Check user progress from localStorage
  useEffect(() => {
    try {
      // Find programs with saved progress
      let bestActive = null;
      let maxCompletedSets = 0;

      programs.forEach((prog) => {
        const savedSets = JSON.parse(localStorage.getItem(`forge_prog_sets_${prog.slug}`) || '{}');
        const completedCount = Object.values(savedSets).filter(Boolean).length;
        const totalSets = prog.schedule.reduce(
          (sum, d) => sum + d.exercises.reduce((sSum, e) => sSum + e.sets, 0),
          0
        );

        if (completedCount > maxCompletedSets) {
          maxCompletedSets = completedCount;
          bestActive = {
            program: prog,
            completedSets: completedCount,
            totalSets,
            pct: Math.min(100, Math.round((completedCount / totalSets) * 100)),
          };
        }
      });

      if (bestActive && bestActive.completedSets > 0) {
        setActiveProgramStats(bestActive);
      }

    } catch { }
  }, []);

  useEffect(() => {
    setWorkoutHistory(readWorkoutHistory(user?.uid).slice(0, 3));
  }, [user?.uid]);

  const filteredPrograms = useMemo(() => {
    if (filterDifficulty === 'all') return programs;
    return programs.filter((p) => p.difficulty === filterDifficulty);
  }, [filterDifficulty]);

  return (
    <div className="section">
      <div className="container-main">
        <SectionHeading
          label="Program Workout"
          title={<>PILIH <span className="text-accent">PROGRAM LATIHAN</span></>}
          subtitle="Program terstruktur dengan jadwal, beban gerakan, stopwatch terintegrasi, dan timer istirahat. Mulai perjalanan kebugaranmu hari ini."
        />

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 bg-bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-accent" />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm text-text-primary mb-0.5">{title}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* In-Progress Workout Banner (If user has progress) */}
        {activeProgramStats && (
          <div className="mb-10 p-5 rounded-3xl bg-gradient-to-r from-accent/15 via-bg-card to-accent/5 border border-accent/30 shadow-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="badge-accent text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={10} /> Program Sedang Berjalan
                </span>
                <span className="text-xs text-text-secondary">
                  {activeProgramStats.pct}% Selesai
                </span>
              </div>
              <h3 className="font-heading font-black text-xl text-text-primary">
                {activeProgramStats.program.name}
              </h3>
              <p className="text-text-secondary text-xs">
                {activeProgramStats.completedSets} dari total {activeProgramStats.totalSets} set latihan telah tuntas.
              </p>
            </div>

            <button
              onClick={() => navigate(`/program/${activeProgramStats.program.slug}`)}
              className="btn-primary text-sm py-2.5 px-6 shadow-glow flex items-center gap-2 flex-shrink-0"
            >
              <Play size={14} /> Lanjutkan Latihan
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Semua Program' },
              { id: 'beginner', label: 'Pemula' },
              { id: 'intermediate', label: 'Menengah' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterDifficulty(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all duration-200 ${
                  filterDifficulty === tab.id
                    ? 'bg-accent text-bg-primary shadow-sm'
                    : 'bg-bg-card text-text-secondary border border-border hover:border-accent/40 hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-text-secondary font-medium">
            Menampilkan {filteredPrograms.length} Program
          </span>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {filteredPrograms.map((program) => (
            <WorkoutCard key={program.id} program={program} />
          ))}
        </div>

        {/* Recent Workout History Section */}
        {workoutHistory.length > 0 && (
          <div className="mb-10 bg-bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-text-primary flex items-center gap-2">
                <History size={16} className="text-accent" /> Sesi Latihan Terakhir
              </h3>
              <span className="text-xs text-text-secondary font-medium">
                Tersimpan di Perangkat
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {workoutHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-bg-secondary border border-border/80 flex flex-col justify-between gap-2"
                >
                  <div>
                    <span className="text-[10px] text-accent font-semibold uppercase">{item.dayLabel}</span>
                    <p className="font-heading font-bold text-sm text-text-primary truncate">{item.programName}</p>
                    <p className="text-[11px] text-text-secondary">{item.date}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
                    <span className="text-text-secondary flex items-center gap-1">
                      <Clock size={11} className="text-accent" /> {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s
                    </span>
                    <span className="text-text-primary font-semibold flex items-center gap-1">
                      <Flame size={11} className="text-accent" /> ~{item.caloriesBurned} kkal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Box */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-center">
          <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">
            💡 <strong className="text-text-primary">Panduan memilih program:</strong> Jika kamu baru memulai, pilih{' '}
            <button onClick={() => navigate('/program/full-body-starter')} className="text-accent hover:underline font-semibold">
              Full Body Starter
            </button>
            . Setelah 4 minggu konsisten, tingkatkan ke{' '}
            <button onClick={() => navigate('/program/upper-lower-split')} className="text-accent hover:underline font-semibold">
              Upper / Lower Split
            </button>
            . Untuk intensitas kardio dan pengencangan perut, pilih{' '}
            <button onClick={() => navigate('/program/core-cardio')} className="text-accent hover:underline font-semibold">
              Core & Cardio
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
