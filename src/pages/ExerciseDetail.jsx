import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle2, Circle, Target, Dumbbell, BarChart3,
  Clock, AlertTriangle, Lightbulb, ChevronRight
} from 'lucide-react';
import { exercises } from '../data/exercises';

const difficultyStyle = {
  beginner: 'badge-accent',
  intermediate: 'badge-warning',
  advanced: 'badge-error',
};

export default function ExerciseDetail() {
  const { slug: routeSlug, id } = useParams();
  const slug = routeSlug || id;
  const navigate = useNavigate();
  const exercise = exercises.find((e) => e.slug === slug || e.id === slug);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!exercise) return;
    try {
      const completed = JSON.parse(localStorage.getItem('forge_completed') || '[]');
      setIsCompleted(completed.includes(slug));
    } catch {
      setIsCompleted(false);
    }
  }, [slug, exercise]);

  const toggleCompleted = () => {
    try {
      const completed = JSON.parse(localStorage.getItem('forge_completed') || '[]');
      let updated;
      if (isCompleted) {
        updated = completed.filter((s) => s !== slug);
      } else {
        updated = [...completed, slug];
      }
      localStorage.setItem('forge_completed', JSON.stringify(updated));
      setIsCompleted(!isCompleted);
    } catch (e) {
      console.error(e);
    }
  };

  if (!exercise) {
    return (
      <div className="section">
        <div className="container-main text-center py-24">
          <p className="font-heading font-bold text-2xl text-text-primary mb-2">Latihan tidak ditemukan</p>
          <p className="text-text-secondary mb-6">Latihan dengan slug "{slug}" tidak tersedia.</p>
          <button onClick={() => navigate('/latihan')} className="btn-primary">
            <ArrowLeft size={16} /> Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  const relatedExercises = exercises.filter(
    (e) => e.muscleGroup === exercise.muscleGroup && e.slug !== exercise.slug
  ).slice(0, 3);

  const easierExercises = exercise.easier
    .map((s) => exercises.find((e) => e.slug === s))
    .filter(Boolean);

  const harderExercises = exercise.harder
    .map((s) => exercises.find((e) => e.slug === s))
    .filter(Boolean);

  return (
    <div className="section">
      <div className="container-main max-w-4xl">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost mb-6 -ml-2 text-sm"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 bg-bg-secondary">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card/60 to-transparent" />
            <span className={`absolute top-3 left-3 badge ${difficultyStyle[exercise.difficulty] || 'badge-neutral'}`}>
              {exercise.difficultyLabel}
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="font-heading font-black text-3xl md:text-4xl text-text-primary mb-2 leading-tight">
                {exercise.name}
              </h1>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                {exercise.description}
              </p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-bg-secondary rounded-xl p-3 flex items-center gap-2">
                  <Target size={14} className="text-accent flex-shrink-0" />
                  <div>
                    <p className="text-text-secondary text-xs">Otot Utama</p>
                    <p className="text-text-primary text-sm font-medium">{exercise.muscleGroupLabel}</p>
                  </div>
                </div>
                <div className="bg-bg-secondary rounded-xl p-3 flex items-center gap-2">
                  <Dumbbell size={14} className="text-accent flex-shrink-0" />
                  <div>
                    <p className="text-text-secondary text-xs">Peralatan</p>
                    <p className="text-text-primary text-sm font-medium">{exercise.equipmentLabel}</p>
                  </div>
                </div>
                <div className="bg-bg-secondary rounded-xl p-3 flex items-center gap-2">
                  <BarChart3 size={14} className="text-accent flex-shrink-0" />
                  <div>
                    <p className="text-text-secondary text-xs">Set × Repetisi</p>
                    <p className="text-text-primary text-sm font-medium">{exercise.sets} set × {exercise.reps}</p>
                  </div>
                </div>
                <div className="bg-bg-secondary rounded-xl p-3 flex items-center gap-2">
                  <Clock size={14} className="text-accent flex-shrink-0" />
                  <div>
                    <p className="text-text-secondary text-xs">Istirahat</p>
                    <p className="text-text-primary text-sm font-medium">{exercise.restSeconds} detik</p>
                  </div>
                </div>
              </div>

              {/* Secondary muscles */}
              {exercise.secondaryMuscles.length > 0 && (
                <div className="mb-5">
                  <p className="text-text-secondary text-xs mb-2">Otot Sekunder:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.secondaryMuscles.map((m) => (
                      <span key={m} className="badge-neutral text-xs">{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Complete Button */}
            <button
              onClick={toggleCompleted}
              className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-heading font-bold text-sm transition-all duration-300 ${
                isCompleted
                  ? 'bg-accent/20 border border-accent text-accent hover:bg-accent/10'
                  : 'btn-primary'
              }`}
              aria-pressed={isCompleted}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={16} /> Selesai! Tandai Ulang?
                </>
              ) : (
                <>
                  <Circle size={16} /> Tandai Selesai
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="card p-6 mb-5">
          <h2 className="font-heading font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-accent rounded-md flex items-center justify-center text-bg-primary text-xs font-black">1</span>
            Cara Melakukan
          </h2>
          <ol className="space-y-3">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-text-secondary text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Mistakes & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="card p-6">
            <h2 className="font-heading font-bold text-base text-text-primary mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-warning" /> Kesalahan Umum
            </h2>
            <ul className="space-y-2.5">
              {exercise.commonMistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-warning mt-0.5 flex-shrink-0">✗</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="font-heading font-bold text-base text-text-primary mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-accent" /> Tips Teknik
            </h2>
            <ul className="space-y-2.5">
              {exercise.tips.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Alternatives */}
        {(easierExercises.length > 0 || harderExercises.length > 0) && (
          <div className="card p-6 mb-8">
            <h2 className="font-heading font-bold text-base text-text-primary mb-4">
              Alternatif Latihan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {easierExercises.length > 0 && (
                <div>
                  <p className="text-text-secondary text-xs uppercase tracking-wide font-medium mb-2">Lebih Ringan</p>
                  {easierExercises.map((ex) => (
                    <Link
                      key={ex.slug}
                      to={`/latihan/${ex.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary hover:bg-bg-secondary/70 hover:border-accent/30 border border-transparent transition-all duration-200 mb-2"
                    >
                      <div>
                        <p className="text-text-primary text-sm font-medium">{ex.name}</p>
                        <p className="text-text-secondary text-xs">{ex.difficultyLabel}</p>
                      </div>
                      <ChevronRight size={14} className="text-text-secondary" />
                    </Link>
                  ))}
                </div>
              )}
              {harderExercises.length > 0 && (
                <div>
                  <p className="text-text-secondary text-xs uppercase tracking-wide font-medium mb-2">Lebih Berat</p>
                  {harderExercises.map((ex) => (
                    <Link
                      key={ex.slug}
                      to={`/latihan/${ex.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary hover:bg-bg-secondary/70 hover:border-accent/30 border border-transparent transition-all duration-200 mb-2"
                    >
                      <div>
                        <p className="text-text-primary text-sm font-medium">{ex.name}</p>
                        <p className="text-text-secondary text-xs">{ex.difficultyLabel}</p>
                      </div>
                      <ChevronRight size={14} className="text-text-secondary" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Exercises */}
        {relatedExercises.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-lg text-text-primary mb-4">
              Latihan {exercise.muscleGroupLabel} Lainnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedExercises.map((ex) => (
                <Link
                  key={ex.slug}
                  to={`/latihan/${ex.slug}`}
                  className="card p-4 hover:border-accent/30 flex items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg-secondary flex-shrink-0">
                    <img
                      src={ex.image}
                      alt={ex.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <p className="text-text-primary text-sm font-heading font-semibold leading-tight">{ex.name}</p>
                    <p className="text-text-secondary text-xs">{ex.difficultyLabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
