export default function ProgressBar({ value = 0, max = 100, label, showPercentage = true, className = '' }) {
  const percentage = Math.round((value / max) * 100);
  const clampedPct = Math.min(100, Math.max(0, percentage));

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-text-secondary text-sm">{label}</span>}
          {showPercentage && (
            <span className="text-accent font-heading font-bold text-sm tabular-nums">
              {clampedPct}%
            </span>
          )}
        </div>
      )}
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progres'}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${clampedPct}%` }}
        />
      </div>
    </div>
  );
}
