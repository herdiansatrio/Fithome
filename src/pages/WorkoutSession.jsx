import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  ArrowLeft, Play, Pause, RotateCcw, CheckCircle2, Circle,
  ChevronRight, Calendar, Clock, Flame, Target, Volume2, VolumeX,
  Eye, Award, History, Check, Plus, Minus, X, Sparkles
} from 'lucide-react';
import { programs } from '../data/programs';
import { exercises } from '../data/exercises';
import ProgressBar from '../components/ProgressBar';
import ExerciseQuickModal from '../components/ExerciseQuickModal';
import { sound } from '../utils/audio';
import { auth } from '../utils/firebase';
import { readWorkoutHistory, writeWorkoutHistory } from '../utils/workoutHistory';

export default function WorkoutSession() {
  const { slug: routeSlug, id } = useParams();
  const slug = routeSlug || id;
  const navigate = useNavigate();
  const program = programs.find((p) => p.slug === slug || p.id === slug);

  // States
  const [activeDay, setActiveDay] = useState(0);
  const [checkedSets, setCheckedSets] = useState({}); // key: day_0_ex_1_set_0
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Rest Timer State
  const [restRemaining, setRestRemaining] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restPaused, setRestPaused] = useState(false);

  // Modals & Panels
  const [previewExercise, setPreviewExercise] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [user, setUser] = useState(auth?.currentUser ?? null);
  const [sessionSaved, setSessionSaved] = useState(false);

  const sessionIntervalRef = useRef(null);
  const restIntervalRef = useRef(null);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Load progress & history from localStorage
  useEffect(() => {
    if (!program) return;
    try {
      const savedSets = JSON.parse(localStorage.getItem(`forge_prog_sets_${slug}`) || '{}');
      setCheckedSets(savedSets);

    } catch { }
  }, [slug, program]);

  useEffect(() => {
    setWorkoutHistory(readWorkoutHistory(user?.uid));
  }, [user?.uid]);

  // Save progress
  useEffect(() => {
    if (!program) return;
    try {
      localStorage.setItem(`forge_prog_sets_${slug}`, JSON.stringify(checkedSets));
    } catch { }
  }, [checkedSets, slug, program]);

  // Session Stopwatch
  useEffect(() => {
    if (timerRunning) {
      sessionIntervalRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(sessionIntervalRef.current);
    }
    return () => clearInterval(sessionIntervalRef.current);
  }, [timerRunning]);

  // Rest Timer Countdown
  useEffect(() => {
    if (isResting && !restPaused && restRemaining > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 4 && prev > 1) {
            sound.playCountdownTick();
          } else if (prev === 1) {
            sound.playRestDone();
          }

          if (prev <= 1) {
            clearInterval(restIntervalRef.current);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(restIntervalRef.current);
    }
    return () => clearInterval(restIntervalRef.current);
  }, [isResting, restPaused, restRemaining]);

  const toggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Helper keys
  const setKey = (dayIdx, exIdx, setIdx) => `d${dayIdx}_e${exIdx}_s${setIdx}`;

  const currentDaySchedule = program?.schedule[activeDay];

  // Helper to extract numeric rest seconds from string like '60 detik'
  const parseRestSeconds = (restStr) => {
    if (!restStr) return 45;
    const match = restStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 45;
  };

  // Start rest timer
  const triggerRest = (seconds) => {
    setRestRemaining(seconds);
    setIsResting(true);
    setRestPaused(false);
  };

  // Check if an entire exercise is completed
  const isExerciseDone = (dayIdx, exIdx, totalSets) => {
    for (let s = 0; s < totalSets; s++) {
      if (!checkedSets[setKey(dayIdx, exIdx, s)]) return false;
    }
    return totalSets > 0;
  };

  // How many sets done for an exercise
  const getExerciseDoneSetsCount = (dayIdx, exIdx, totalSets) => {
    let count = 0;
    for (let s = 0; s < totalSets; s++) {
      if (checkedSets[setKey(dayIdx, exIdx, s)]) count++;
    }
    return count;
  };

  // Toggle single set
  const toggleSet = (dayIdx, exIdx, setIdx, restSec) => {
    const key = setKey(dayIdx, exIdx, setIdx);
    const willBeChecked = !checkedSets[key];

    setCheckedSets((prev) => ({
      ...prev,
      [key]: willBeChecked,
    }));

    // Auto start session timer on first interaction if not yet started
    if (!sessionStarted) {
      setSessionStarted(true);
      setTimerRunning(true);
    }

    // If checked a set, trigger rest timer
    if (willBeChecked) {
      triggerRest(restSec);
    }
  };

  // Toggle all sets of an exercise
  const toggleAllSetsOfExercise = (dayIdx, exIdx, totalSets, restSec) => {
    const currentlyDone = isExerciseDone(dayIdx, exIdx, totalSets);
    const updated = { ...checkedSets };

    for (let s = 0; s < totalSets; s++) {
      const key = setKey(dayIdx, exIdx, s);
      if (currentlyDone) {
        delete updated[key];
      } else {
        updated[key] = true;
      }
    }

    setCheckedSets(updated);

    if (!sessionStarted) {
      setSessionStarted(true);
      setTimerRunning(true);
    }

    if (!currentlyDone) {
      triggerRest(restSec);
    }
  };

  // Day calculations
  const totalDayExercises = currentDaySchedule?.exercises.length || 0;
  const completedDayExercises = currentDaySchedule
    ? currentDaySchedule.exercises.filter((item, i) => isExerciseDone(activeDay, i, item.sets)).length
    : 0;

  const totalDaySets = currentDaySchedule
    ? currentDaySchedule.exercises.reduce((sum, item) => sum + item.sets, 0)
    : 0;
  const completedDaySets = currentDaySchedule
    ? currentDaySchedule.exercises.reduce(
        (sum, item, i) => sum + getExerciseDoneSetsCount(activeDay, i, item.sets),
        0
      )
    : 0;

  // Calorie estimation: ~7 kcal per minute of active workout
  const estimatedCalories = Math.max(12, Math.round((timerSeconds / 60) * 7.5));

  // Trigger celebration when day finishes
  useEffect(() => {
    if (
      totalDayExercises > 0 &&
      completedDayExercises === totalDayExercises &&
      sessionStarted &&
      !showCompleteModal &&
      !sessionSaved
    ) {
      sound.playSessionComplete();
      setShowCompleteModal(true);
    }
  }, [completedDayExercises, totalDayExercises, sessionStarted, showCompleteModal, sessionSaved]);

  const handleStartSession = () => {
    setSessionStarted(true);
    setTimerRunning(true);
  };

  const handleResetSession = () => {
    if (window.confirm('Reset timer sesi ini ke 0?')) {
      setTimerSeconds(0);
      setTimerRunning(false);
      setSessionStarted(false);
    }
  };

  const clearDayProgress = () => {
    if (window.confirm('Reset semua centang latihan untuk hari ini?')) {
      const updated = { ...checkedSets };
      currentDaySchedule?.exercises.forEach((item, exIdx) => {
        for (let s = 0; s < item.sets; s++) {
          delete updated[setKey(activeDay, exIdx, s)];
        }
      });
      setCheckedSets(updated);
      setSessionSaved(false);
    }
  };

  const saveSessionToHistory = () => {
    const newEntry = {
      id: Date.now(),
      programName: program.name,
      programSlug: program.slug,
      dayLabel: currentDaySchedule?.label || `Hari ${activeDay + 1}`,
      durationSeconds: timerSeconds,
      caloriesBurned: estimatedCalories,
      completedSets: completedDaySets,
      totalSets: totalDaySets,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = [newEntry, ...workoutHistory].slice(0, 30);
    setWorkoutHistory(updated);
    writeWorkoutHistory(user?.uid, updated);

    setSessionSaved(true);
    setShowCompleteModal(false);
    alert('🎉 Sesi berhasil dicatat ke Riwayat Latihan!');
  };

  if (!program) {
    return (
      <div className="section">
        <div className="container-main text-center py-24">
          <p className="font-heading font-bold text-2xl text-text-primary mb-2">Program tidak ditemukan</p>
          <p className="text-text-secondary text-sm mb-6">Program dengan ID/slug "{slug}" tidak tersedia.</p>
          <button onClick={() => navigate('/program')} className="btn-primary">
            <ArrowLeft size={16} /> Kembali ke Semua Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-main max-w-5xl">
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/program')} className="btn-ghost -ml-2 text-sm">
            <ArrowLeft size={16} /> Semua Program
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              title="Lihat riwayat latihan yang telah diselesaikan"
            >
              <History size={14} className="text-accent" /> Riwayat ({workoutHistory.length})
            </button>
            <button
              onClick={toggleSound}
              className="btn-ghost p-2 text-text-secondary hover:text-text-primary rounded-xl"
              title={soundEnabled ? 'Matikan Suara Beep' : 'Nyalakan Suara Beep'}
            >
              {soundEnabled ? <Volume2 size={16} className="text-accent" /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>

        {/* Hero Program Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 border border-border bg-bg-card shadow-xl">
          <img
            src={program.image}
            alt={program.name}
            className="w-full h-44 md:h-56 object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/95 via-bg-primary/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-accent text-xs font-semibold">{program.difficultyLabel}</span>
              <span className="badge-neutral text-xs">{program.daysPerWeek} Hari/Minggu</span>
            </div>
            <h1 className="font-heading font-black text-2xl md:text-4xl text-text-primary leading-tight mb-1">
              {program.name}
            </h1>
            <p className="text-text-secondary text-xs md:text-sm max-w-xl">{program.subtitle}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Calendar, label: 'Jadwal', value: `${program.daysPerWeek} Hari / Pekan` },
            { icon: Clock, label: 'Estimasi Durasi', value: program.sessionDuration },
            { icon: Flame, label: 'Masa Program', value: `${program.totalWeeks} Minggu` },
            { icon: Target, label: 'Tingkat', value: program.difficultyLabel },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-bg-card border border-border rounded-2xl p-3.5 text-center shadow-sm">
              <Icon size={16} className="text-accent mx-auto mb-1.5" />
              <p className="text-text-primary font-heading font-bold text-sm">{value}</p>
              <p className="text-text-secondary text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Rest Timer Float / Docked Banner (When Active) */}
        {isResting && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-accent/20 via-bg-card to-accent/10 border-2 border-accent shadow-glow flex flex-wrap items-center justify-between gap-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent text-bg-primary flex items-center justify-center font-heading font-black text-xl animate-pulse">
                {restRemaining}s
              </div>
              <div>
                <p className="font-heading font-bold text-text-primary text-sm flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent" /> Waktu Istirahat
                </p>
                <p className="text-text-secondary text-xs">
                  Tarik napas dalam, siapkan diri untuk set berikutnya!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestRemaining((r) => Math.max(0, r - 15))}
                className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                title="Kurangi 15 detik"
              >
                <Minus size={12} /> 15s
              </button>
              <button
                onClick={() => setRestRemaining((r) => r + 15)}
                className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                title="Tambah 15 detik"
              >
                <Plus size={12} /> 15s
              </button>
              <button
                onClick={() => setRestPaused((p) => !p)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                {restPaused ? 'Lanjut' : 'Jeda'}
              </button>
              <button
                onClick={() => {
                  setIsResting(false);
                  setRestRemaining(0);
                }}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Lewati <Check size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Main Workout Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Day Selector (Sidebar) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold">
                Jadwal Program
              </p>
              <span className="text-[11px] text-accent font-medium">
                {program.schedule.length} Sesi Terjadwal
              </span>
            </div>

            {program.schedule.map((day, idx) => {
              const dayTotalEx = day.exercises.length;
              const dayDoneEx = day.exercises.filter((item, exI) =>
                isExerciseDone(idx, exI, item.sets)
              ).length;
              const isFullyDone = dayTotalEx > 0 && dayDoneEx === dayTotalEx;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveDay(idx);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${
                    activeDay === idx
                      ? 'border-accent bg-accent/10 shadow-sm text-text-primary'
                      : 'border-border bg-bg-card text-text-secondary hover:border-accent/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-text-primary">{day.day}</span>
                      {isFullyDone && (
                        <span className="badge-accent text-[10px] py-0 px-1.5">Selesai</span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary font-medium">{day.label}</p>
                    <p className="text-[11px] opacity-75">{day.focus}</p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs font-semibold text-text-primary">
                      {dayDoneEx}/{dayTotalEx}
                    </span>
                    <span className="text-[10px] text-text-secondary">gerakan</span>
                    {isFullyDone ? (
                      <CheckCircle2 size={16} className="text-accent mt-1" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-border mt-1" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Quick Helper Tips */}
            <div className="p-4 bg-bg-card border border-border rounded-2xl text-xs text-text-secondary space-y-1.5">
              <p className="font-semibold text-text-primary">💡 Tips Latihan:</p>
              <p>• Klik nomor <strong className="text-text-primary">Set</strong> untuk menandai set selesai dan memulai timer istirahat otomatis.</p>
              <p>• Gunakan ikon <strong className="text-text-primary">Mata/Panduan</strong> untuk melihat panduan form gerakan tanpa keluar dari halaman.</p>
            </div>
          </div>

          {/* Active Workout Session Panel */}
          <div className="lg:col-span-2">
            <div className="card p-5 md:p-6 shadow-lg border border-border">
              {/* Day Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-neutral text-[10px] uppercase font-bold mb-1">
                    {currentDaySchedule?.day}
                  </span>
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-text-primary">
                    {currentDaySchedule?.label}
                  </h2>
                  <p className="text-text-secondary text-xs md:text-sm mt-0.5">
                    Fokus Latihan: <strong className="text-text-primary">{currentDaySchedule?.focus}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearDayProgress}
                    className="btn-ghost text-xs p-2 text-text-secondary hover:text-error"
                    title="Reset centang hari ini"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Set Stats */}
              <div className="mb-5 space-y-2">
                <ProgressBar
                  value={completedDayExercises}
                  max={totalDayExercises}
                  label={`${completedDayExercises} dari ${totalDayExercises} gerakan tuntas (${completedDaySets}/${totalDaySets} set)`}
                />
              </div>

              {/* Live Stopwatch & Calorie Dashboard */}
              <div className="bg-bg-secondary rounded-2xl p-4 mb-6 border border-border/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold">
                      Durasi Sesi
                    </p>
                    <p className="timer-display text-3xl font-black text-text-primary">
                      {formatTime(timerSeconds)}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-border hidden sm:block" />
                  <div className="hidden sm:block">
                    <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Flame size={12} className="text-accent" /> Kalori Aktif
                    </p>
                    <p className="text-lg font-bold font-heading text-text-primary">
                      ~{estimatedCalories} <span className="text-xs font-normal text-text-secondary">kkal</span>
                    </p>
                  </div>
                </div>

                {/* Session Timer Controls */}
                <div className="flex items-center gap-2">
                  {!sessionStarted ? (
                    <button onClick={handleStartSession} className="btn-primary text-xs py-2.5 px-4 shadow-glow">
                      <Play size={14} /> Mulai Latihan
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setTimerRunning((r) => !r)}
                        className={`btn-secondary text-xs py-2.5 px-3 ${
                          timerRunning ? 'border-warning text-warning' : 'border-accent text-accent'
                        }`}
                      >
                        {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                        {timerRunning ? 'Jeda' : 'Lanjut'}
                      </button>
                      <button
                        onClick={handleResetSession}
                        className="btn-ghost text-xs p-2.5 text-text-secondary hover:text-text-primary"
                        title="Reset stopwatch"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Exercise List with Interactive Set-by-Set Tracking */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-heading font-bold text-sm text-text-primary">
                    Daftar Gerakan ({totalDayExercises})
                  </h3>
                  <span className="text-xs text-text-secondary">
                    Total {totalDaySets} Set Latihan
                  </span>
                </div>

                {currentDaySchedule?.exercises.map((item, exIdx) => {
                  const ex = exercises.find((e) => e.slug === item.exerciseSlug);
                  const restSec = parseRestSeconds(item.rest);
                  const isDone = isExerciseDone(activeDay, exIdx, item.sets);
                  const completedSetsCount = getExerciseDoneSetsCount(activeDay, exIdx, item.sets);

                  return (
                    <div
                      key={exIdx}
                      className={`rounded-2xl border p-4 transition-all duration-200 ${
                        isDone
                          ? 'border-accent/40 bg-accent/5'
                          : 'border-border bg-bg-secondary hover:border-accent/30'
                      }`}
                    >
                      {/* Top Exercise Row */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Toggle all sets button */}
                          <button
                            onClick={() => toggleAllSetsOfExercise(activeDay, exIdx, item.sets, restSec)}
                            className="flex-shrink-0 hover:scale-110 transition-transform"
                            aria-label={isDone ? 'Tandai belum tuntas' : 'Tandai semua set tuntas'}
                          >
                            {isDone ? (
                              <CheckCircle2 size={24} className="text-accent" />
                            ) : (
                              <Circle size={24} className="text-text-secondary" />
                            )}
                          </button>

                          {/* Exercise Name & Info */}
                          <div className="min-w-0">
                            <h4 className={`font-heading font-bold text-base leading-snug truncate ${
                              isDone ? 'line-through text-text-secondary' : 'text-text-primary'
                            }`}>
                              {ex?.name || item.exerciseSlug}
                            </h4>
                            <p className="text-text-secondary text-xs">
                              Target: <strong className="text-text-primary">{item.sets} Set × {item.reps}</strong> • Istirahat: {item.rest}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Quick Guide preview button */}
                          {ex && (
                            <button
                              onClick={() => setPreviewExercise(ex)}
                              className="btn-ghost text-xs py-1.5 px-2.5 flex items-center gap-1 text-text-secondary hover:text-accent rounded-lg border border-border"
                              title="Lihat petunjuk teknik gerakan"
                            >
                              <Eye size={13} />
                              <span className="hidden sm:inline">Panduan</span>
                            </button>
                          )}

                          {/* Full page link */}
                          {ex && (
                            <Link
                              to={`/latihan/${ex.slug}`}
                              className="p-1.5 text-text-secondary hover:text-accent transition-colors"
                              title="Buka halaman detail latihan lengkap"
                            >
                              <ChevronRight size={16} />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Interactive Set Pills */}
                      <div className="pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                            Set Selesai ({completedSetsCount}/{item.sets})
                          </span>
                          <button
                            onClick={() => triggerRest(restSec)}
                            className="text-[11px] text-accent hover:underline flex items-center gap-1"
                          >
                            <Clock size={11} /> Istirahat {item.rest}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: item.sets }).map((_, sIdx) => {
                            const isSetChecked = !!checkedSets[setKey(activeDay, exIdx, sIdx)];
                            return (
                              <button
                                key={sIdx}
                                onClick={() => toggleSet(activeDay, exIdx, sIdx, restSec)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                                  isSetChecked
                                    ? 'bg-accent text-bg-primary border-accent shadow-sm'
                                    : 'bg-bg-card text-text-secondary border-border hover:border-accent/50 hover:text-text-primary'
                                }`}
                              >
                                {isSetChecked ? <Check size={12} className="stroke-[3]" /> : null}
                                <span>Set {sIdx + 1}</span>
                                <span className="opacity-75 text-[10px]">({item.reps})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Complete Action Banner */}
              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-heading font-bold text-sm text-text-primary">
                    {completedDayExercises === totalDayExercises && totalDayExercises > 0
                      ? '🎉 Semua latihan hari ini sudah tuntas!'
                      : `${completedDayExercises}/${totalDayExercises} gerakan telah diselesaikan.`}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Waktu: {formatTime(timerSeconds)} • Kalori: ~{estimatedCalories} kkal
                  </p>
                </div>

                <button
                  onClick={() => setShowCompleteModal(true)}
                  disabled={completedDayExercises === 0}
                  className={`btn-primary text-sm py-2.5 px-6 shadow-glow ${
                    completedDayExercises === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Award size={16} /> Selesaikan & Simpan Sesi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Program Summary Card */}
        <div className="mt-8 bg-bg-card border border-border rounded-2xl p-6">
          <h3 className="font-heading font-bold text-base text-text-primary mb-2">Tentang Program Ini</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">{program.description}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="badge-neutral"><strong className="text-text-primary">Target:</strong> {program.target}</span>
            <span className="badge-neutral"><strong className="text-text-primary">Durasi:</strong> {program.totalWeeks} Minggu</span>
          </div>
        </div>
      </div>

      {/* Quick Exercise Guide Modal */}
      <ExerciseQuickModal
        exercise={previewExercise}
        isOpen={!!previewExercise}
        onClose={() => setPreviewExercise(null)}
      />

      {/* Workout Complete Celebration Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-bg-card border-2 border-accent rounded-3xl p-6 shadow-2xl text-center animate-scale-up">
            <button
              onClick={() => setShowCompleteModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:text-text-primary"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent animate-bounce">
              <Award size={36} />
            </div>

            <h3 className="font-heading font-black text-2xl text-text-primary mb-1">
              SESI LATIHAN SELESAI!
            </h3>
            <p className="text-text-secondary text-xs mb-6">
              Luar biasa! Kamu telah menyelesaikan sesi <strong className="text-text-primary">{currentDaySchedule?.label}</strong> pada program {program.name}.
            </p>

            {/* Workout Summary Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="bg-bg-secondary p-3 rounded-2xl border border-border">
                <Clock size={16} className="text-accent mx-auto mb-1" />
                <p className="font-heading font-bold text-base text-text-primary">{formatTime(timerSeconds)}</p>
                <p className="text-[10px] text-text-secondary">Waktu Latihan</p>
              </div>
              <div className="bg-bg-secondary p-3 rounded-2xl border border-border">
                <Flame size={16} className="text-accent mx-auto mb-1" />
                <p className="font-heading font-bold text-base text-text-primary">~{estimatedCalories}</p>
                <p className="text-[10px] text-text-secondary">Kkal Terbakar</p>
              </div>
              <div className="bg-bg-secondary p-3 rounded-2xl border border-border">
                <CheckCircle2 size={16} className="text-accent mx-auto mb-1" />
                <p className="font-heading font-bold text-base text-text-primary">
                  {completedDaySets}/{totalDaySets}
                </p>
                <p className="text-[10px] text-text-secondary">Set Tuntas</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={saveSessionToHistory}
                className="btn-primary w-full justify-center text-sm py-3 shadow-glow"
              >
                <Check size={16} /> Simpan Sesi ke Riwayat
              </button>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="btn-secondary w-full justify-center text-sm py-2.5"
              >
                Tutup & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workout History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-bg-card border border-border rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <History size={18} className="text-accent" />
                <h3 className="font-heading font-bold text-lg text-text-primary">
                  Riwayat Latihan Tersimpan
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-3 flex-1">
              {workoutHistory.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <Award size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">Belum ada riwayat latihan</p>
                  <p className="text-xs mt-1">Selesaikan satu sesi latihan dan simpan hasilnya di sini.</p>
                </div>
              ) : (
                workoutHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-bg-secondary border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-heading font-bold text-sm text-text-primary">{item.programName}</p>
                      <p className="text-accent font-medium">{item.dayLabel}</p>
                      <p className="text-text-secondary text-[11px] mt-0.5">{item.date}</p>
                    </div>

                    <div className="text-right space-y-0.5">
                      <p className="font-semibold text-text-primary">{formatTime(item.durationSeconds)}</p>
                      <p className="text-text-secondary">~{item.caloriesBurned} kkal</p>
                      <p className="text-[10px] text-accent font-medium">{item.completedSets} set tuntas</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              {workoutHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Hapus seluruh catatan riwayat latihan?')) {
                      setWorkoutHistory([]);
                      writeWorkoutHistory(user?.uid, []);
                    }
                  }}
                  className="text-xs text-error hover:underline"
                >
                  Hapus Riwayat
                </button>
              )}
              <button
                onClick={() => setShowHistoryModal(false)}
                className="btn-primary text-xs py-2 px-4 ml-auto"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
