import { X, CheckCircle2, AlertTriangle, Lightbulb, Target, Dumbbell, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExerciseQuickModal({ exercise, isOpen, onClose }) {
  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-bg-secondary">
          <div className="flex items-center gap-2">
            <span className="badge-accent text-xs">{exercise.difficultyLabel || 'Latihan'}</span>
            <span className="text-text-secondary text-xs">•</span>
            <span className="text-text-secondary text-xs">{exercise.muscleGroupLabel}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
            aria-label="Tutup panduan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Exercise image */}
          <div className="relative h-44 rounded-xl overflow-hidden bg-bg-secondary">
            <img 
              src={exercise.image} 
              alt={exercise.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-heading font-black text-xl text-text-primary leading-tight">
                {exercise.name}
              </h3>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-bg-secondary p-2.5 rounded-xl border border-border">
              <Target size={14} className="text-accent mx-auto mb-1" />
              <p className="font-semibold text-text-primary">{exercise.muscleGroupLabel}</p>
              <p className="text-text-secondary text-[10px]">Otot Utama</p>
            </div>
            <div className="bg-bg-secondary p-2.5 rounded-xl border border-border">
              <Dumbbell size={14} className="text-accent mx-auto mb-1" />
              <p className="font-semibold text-text-primary">{exercise.equipmentLabel}</p>
              <p className="text-text-secondary text-[10px]">Peralatan</p>
            </div>
            <div className="bg-bg-secondary p-2.5 rounded-xl border border-border">
              <Clock size={14} className="text-accent mx-auto mb-1" />
              <p className="font-semibold text-text-primary">{exercise.restSeconds}s</p>
              <p className="text-text-secondary text-[10px]">Istirahat</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-xs leading-relaxed">
            {exercise.description}
          </p>

          {/* Step Instructions */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div>
              <h4 className="font-heading font-bold text-sm text-text-primary mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-accent" /> Cara Melakukan:
              </h4>
              <ol className="space-y-1.5 text-xs text-text-secondary">
                {exercise.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips / Mistakes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
            {exercise.tips && exercise.tips.length > 0 && (
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-3">
                <p className="font-heading font-semibold text-accent mb-1.5 flex items-center gap-1">
                  <Lightbulb size={12} /> Tips Teknik:
                </p>
                <ul className="space-y-1 text-text-secondary text-[11px]">
                  {exercise.tips.slice(0, 2).map((t, idx) => (
                    <li key={idx} className="flex gap-1.5">
                      <span className="text-accent">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
              <div className="bg-warning/5 border border-warning/20 rounded-xl p-3">
                <p className="font-heading font-semibold text-warning mb-1.5 flex items-center gap-1">
                  <AlertTriangle size={12} /> Kesalahan Umum:
                </p>
                <ul className="space-y-1 text-text-secondary text-[11px]">
                  {exercise.commonMistakes.slice(0, 2).map((m, idx) => (
                    <li key={idx} className="flex gap-1.5">
                      <span className="text-warning">✗</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-bg-secondary flex items-center justify-between">
          <Link
            to={`/latihan/${exercise.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-xs font-heading font-semibold flex items-center gap-1 hover:underline"
          >
            Buka Halaman Lengkap <ExternalLink size={12} />
          </Link>
          <button 
            onClick={onClose}
            className="btn-primary text-xs py-2 px-4"
          >
            Kembali ke Sesi
          </button>
        </div>
      </div>
    </div>
  );
}
