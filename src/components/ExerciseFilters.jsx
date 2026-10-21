import { Search, X, SlidersHorizontal } from 'lucide-react';
import { muscleGroups, difficultyLevels, equipmentTypes } from '../data/exercises';

export default function ExerciseFilters({
  search,
  onSearchChange,
  muscleGroup,
  onMuscleGroupChange,
  difficulty,
  onDifficultyChange,
  equipment,
  onEquipmentChange,
  onReset,
  resultCount,
}) {
  const hasActiveFilters =
    search || muscleGroup !== 'all' || difficulty !== 'all' || equipment !== 'all';

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5 mb-8">
      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        <input
          id="exercise-search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari latihan, misal: push-up, squat..."
          className="input-field pl-10 pr-10"
          aria-label="Cari latihan"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Hapus pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-end">
        {/* Muscle Group */}
        <div className="flex-1 min-w-[140px]">
          <label htmlFor="filter-muscle" className="block text-xs text-text-secondary mb-1.5 font-medium">
            Kelompok Otot
          </label>
          <select
            id="filter-muscle"
            value={muscleGroup}
            onChange={(e) => onMuscleGroupChange(e.target.value)}
            className="input-field text-sm py-2.5"
          >
            {muscleGroups.map((g) => (
              <option key={g.value} value={g.value} className="bg-bg-secondary">
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="flex-1 min-w-[130px]">
          <label htmlFor="filter-difficulty" className="block text-xs text-text-secondary mb-1.5 font-medium">
            Tingkat Kesulitan
          </label>
          <select
            id="filter-difficulty"
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="input-field text-sm py-2.5"
          >
            {difficultyLevels.map((d) => (
              <option key={d.value} value={d.value} className="bg-bg-secondary">
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment */}
        <div className="flex-1 min-w-[130px]">
          <label htmlFor="filter-equipment" className="block text-xs text-text-secondary mb-1.5 font-medium">
            Peralatan
          </label>
          <select
            id="filter-equipment"
            value={equipment}
            onChange={(e) => onEquipmentChange(e.target.value)}
            className="input-field text-sm py-2.5"
          >
            {equipmentTypes.map((e) => (
              <option key={e.value} value={e.value} className="bg-bg-secondary">
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset & Count */}
        <div className="flex items-end gap-3 ml-auto">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="btn-ghost text-sm py-2.5 px-3 text-error hover:text-error hover:bg-error/10"
            >
              <X size={14} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
        <SlidersHorizontal size={13} className="text-text-secondary" />
        <span className="text-text-secondary text-xs">
          <span className="text-accent font-semibold">{resultCount}</span> latihan ditemukan
          {hasActiveFilters && ' (filter aktif)'}
        </span>
      </div>
    </div>
  );
}
