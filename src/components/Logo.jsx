export default function Logo({ size = 'md', showText = true, className = '' }) {
  const badgeSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-8 h-8 rounded-xl',
    lg: 'w-10 h-10 rounded-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base lg:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Icon Badge */}
      <div
        className={`${badgeSizes[size] || badgeSizes.md} bg-accent flex items-center justify-center text-bg-primary shadow-glow-sm group-hover:shadow-glow group-hover:scale-105 transition-all duration-300 shrink-0`}
      >
        {/* Custom FitHome Icon (House + Dumbbell) */}
        <svg
          className={`${iconSizes[size] || iconSizes.md}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Atap Rumah */}
          <path d="M3 10.2L12 3l9 7.2" />
          {/* Dinding Rumah */}
          <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" />
          {/* Batang Dumbbell */}
          <path d="M9 15h6" strokeWidth="2.4" />
          {/* Beban Dumbbell Kiri */}
          <rect x="7" y="13" width="2" height="4" rx="0.6" fill="currentColor" />
          <rect x="5.8" y="13.7" width="1.2" height="2.6" rx="0.4" fill="currentColor" />
          {/* Beban Dumbbell Kanan */}
          <rect x="15" y="13" width="2" height="4" rx="0.6" fill="currentColor" />
          <rect x="17" y="13.7" width="1.2" height="2.6" rx="0.4" fill="currentColor" />
        </svg>
      </div>

      {/* Typography Nama Web */}
      {showText && (
        <span
          className={`font-heading font-black ${textSizes[size] || textSizes.md} tracking-tight leading-none transition-colors`}
        >
          Fit<span className="text-accent">Home</span>
        </span>
      )}
    </div>
  );
}
