import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Dumbbell,
  MoveVertical,
  ArrowUpFromLine,
  Zap,
  Target,
  Footprints,
} from 'lucide-react';

// Peta nama icon string → komponen Lucide
const iconMap = {
  Dumbbell,
  MoveVertical,
  ArrowUpFromLine,
  Zap,
  Target,
  FootprintsIcon: Footprints,
};

export default function MuscleCategoryCard({ category }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/latihan?group=${category.id}`);
  };

  const IconComponent = iconMap[category.icon] ?? Dumbbell;

  return (
    <div
      className="card-hover cursor-pointer overflow-hidden group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Lihat latihan ${category.name}`}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback */}
        <div
          className="absolute inset-0 bg-bg-secondary hidden items-center justify-center"
          aria-hidden="true"
        >
          <IconComponent size={40} className="text-accent opacity-60" />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
        {/* Count Badge */}
        <span className="absolute top-3 right-3 badge-accent text-xs">
          {category.count} latihan
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <IconComponent size={18} className="text-accent shrink-0" aria-hidden="true" />
          <h3 className="font-heading font-bold text-base text-text-primary">
            {category.name}
          </h3>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {category.description}
        </p>
        <div className="flex items-center gap-1 text-accent text-xs font-heading font-semibold group-hover:gap-2 transition-all duration-200">
          Lihat Latihan <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
}
