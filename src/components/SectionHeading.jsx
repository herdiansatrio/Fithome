export default function SectionHeading({ label, title, subtitle, centered = false, className = '' }) {
  return (
    <div className={`mb-10 md:mb-14 ${centered ? 'text-center' : ''} ${className}`}>
      {label && (
        <span className="inline-block badge-accent mb-3 text-xs uppercase tracking-widest font-heading font-bold">
          {label}
        </span>
      )}
      <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-text-primary leading-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
