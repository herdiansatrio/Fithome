import { Clock, ArrowRight } from 'lucide-react';

const categoryColors = {
  protein: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
  carbs: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
  fats: 'bg-green-400/20 text-green-400 border-green-400/30',
  hydration: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
  recovery: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
  warmup: 'bg-accent/20 text-accent border-accent/30',
};

export default function ArticleCard({ article, onClick }) {
  return (
    <div
      className="card-hover overflow-hidden group cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Baca artikel: ${article.title}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-bg-secondary">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent" />
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 badge border text-xs ${
            categoryColors[article.category] || 'badge-neutral'
          }`}
        >
          {article.categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-sm md:text-base text-text-primary mb-2 leading-snug line-clamp-2">
          {article.title}
        </h3>
        <p className="text-text-secondary text-xs leading-relaxed mb-3 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-text-secondary text-xs">
            <Clock size={11} className="text-accent" />
            {article.readTime} baca
          </span>
          <span className="flex items-center gap-1 text-accent text-xs font-heading font-semibold group-hover:gap-2 transition-all duration-200">
            Baca <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}
