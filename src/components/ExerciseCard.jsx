import { Link } from 'react-router-dom';
import { Clock, Dumbbell, Target, ChevronRight, CheckCircle2 } from 'lucide-react';

const difficultyColors = {
  beginner: 'badge-accent',
  intermediate: 'badge-warning',
  advanced: 'badge-error',
};

const difficultyDots = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export default function ExerciseCard({ exercise, isCompleted = false }) {
  return (
    <div className={`card-hover overflow-hidden group relative ${isCompleted ? 'border-accent/50' : ''}`}>
      {/* Completed overlay indicator */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10 bg-accent/90 rounded-full p-1">
          <CheckCircle2 size={14} className="text-bg-primary" />
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-bg-secondary">
        <img
          src={exercise.image}
          alt={exercise.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent" />

        {/* Badges on image */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className={`badge text-xs ${difficultyColors[exercise.difficulty] || 'badge-neutral'}`}>
            {exercise.difficultyLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-base text-text-primary mb-1 leading-tight line-clamp-1">
          {exercise.name}
        </h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          <span className="flex items-center gap-1 text-text-secondary text-xs">
            <Target size={11} className="text-accent flex-shrink-0" />
            {exercise.muscleGroupLabel}
          </span>
          <span className="flex items-center gap-1 text-text-secondary text-xs">
            <Dumbbell size={11} className="text-accent flex-shrink-0" />
            {exercise.equipmentLabel}
          </span>
          <span className="flex items-center gap-1 text-text-secondary text-xs">
            <Clock size={11} className="text-accent flex-shrink-0" />
            {exercise.sets}×{exercise.reps}
          </span>
        </div>

        {/* Difficulty dots */}
        <div className="flex items-center justify-between">
          <div className="difficulty-dots" aria-label={`Tingkat kesulitan: ${exercise.difficultyLabel}`}>
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`difficulty-dot ${dot <= (difficultyDots[exercise.difficulty] || 1) ? 'active' : ''}`}
              />
            ))}
          </div>

          <Link
            to={`/latihan/${exercise.slug}`}
            className="flex items-center gap-1 text-accent text-xs font-heading font-semibold hover:gap-2 transition-all duration-200"
            aria-label={`Lihat detail ${exercise.name}`}
          >
            Detail <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
