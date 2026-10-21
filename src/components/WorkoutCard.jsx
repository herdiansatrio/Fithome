import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Flame } from 'lucide-react';

const difficultyStyle = {
  beginner: { badge: 'badge-accent', label: 'Pemula' },
  intermediate: { badge: 'badge-warning', label: 'Menengah' },
  advanced: { badge: 'badge-error', label: 'Lanjutan' },
};

export default function WorkoutCard({ program }) {
  const style = difficultyStyle[program.difficulty] || difficultyStyle.beginner;

  let progressPct = 0;
  try {
    const savedSets = JSON.parse(localStorage.getItem(`forge_prog_sets_${program.slug}`) || '{}');
    const doneSets = Object.values(savedSets).filter(Boolean).length;
    const totalSets = program.schedule?.reduce(
      (sum, d) => sum + d.exercises.reduce((sSum, e) => sSum + e.sets, 0),
      0
    ) || 0;
    if (totalSets > 0 && doneSets > 0) {
      progressPct = Math.min(100, Math.round((doneSets / totalSets) * 100));
    }
  } catch { }

  return (
    <div className="card-hover overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-bg-secondary">
        <img
          src={program.image}
          alt={program.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/40 to-transparent" />
        <span className={`absolute top-3 left-3 badge ${style.badge}`}>
          {style.label}
        </span>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-heading font-black text-xl text-text-primary leading-tight">
            {program.name}
          </h3>
          <p className="text-text-secondary text-xs mt-0.5">{program.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
          {program.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-bg-secondary rounded-xl p-2.5 text-center">
            <Calendar size={14} className="text-accent mx-auto mb-1" />
            <p className="text-text-primary font-heading font-bold text-sm">{program.daysPerWeek}</p>
            <p className="text-text-secondary text-xs">hari/minggu</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-2.5 text-center">
            <Clock size={14} className="text-accent mx-auto mb-1" />
            <p className="text-text-primary font-heading font-bold text-sm leading-tight">{program.sessionDuration}</p>
            <p className="text-text-secondary text-xs">per sesi</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-2.5 text-center">
            <Flame size={14} className="text-accent mx-auto mb-1" />
            <p className="text-text-primary font-heading font-bold text-sm">{program.totalWeeks}</p>
            <p className="text-text-secondary text-xs">minggu</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {program.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge-neutral text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto space-y-2">
          {progressPct > 0 && (
            <div className="flex items-center justify-between text-xs text-text-secondary px-0.5">
              <span>Progres Sesi</span>
              <span className="font-semibold text-accent">{progressPct}%</span>
            </div>
          )}
          <Link
            to={`/program/${program.slug}`}
            className={`w-full justify-center text-sm flex items-center gap-2 ${
              progressPct > 0 ? 'btn-primary shadow-glow' : 'btn-primary'
            }`}
          >
            {progressPct > 0 ? `Lanjutkan Sesi (${progressPct}%)` : 'Lihat Program'}{' '}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
