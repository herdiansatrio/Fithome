import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';

const InstagramIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);

const TwitterIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const footerLinks = {
  Latihan: [
    { to: '/latihan', label: 'Katalog Latihan' },
    { to: '/latihan?filter=chest', label: 'Latihan Dada' },
    { to: '/latihan?filter=core', label: 'Latihan Core' },
    { to: '/latihan?filter=legs', label: 'Latihan Kaki' },
  ],
  Program: [
    { to: '/program', label: 'Semua Program' },
    { to: '/program/full-body-starter', label: 'Full Body Starter' },
    { to: '/program/upper-lower-split', label: 'Upper/Lower Split' },
    { to: '/program/core-cardio', label: 'Core & Cardio' },
  ],
  Tools: [
    { to: '/kalkulator', label: 'Kalkulator BMI' },
    { to: '/kalkulator?tab=calorie', label: 'Kalkulator Kalori' },
    { to: '/nutrisi', label: 'Panduan Nutrisi' },
    { to: '/kalkulator', label: 'Penafian Medis' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border mt-auto">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <Zap size={18} className="text-bg-primary fill-bg-primary" />
              </div>
              <span className="font-heading font-black text-lg tracking-tight">
                FORGE<span className="text-accent">FITNESS</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-xs">
              Platform edukasi kebugaran mandiri di rumah. Bangun tubuh yang lebih kuat, mulai
              dari rumah, tanpa batasan.
            </p>
            <div className="flex gap-3">
              {[
                { icon: InstagramIcon, label: 'Instagram' },
                { icon: YoutubeIcon, label: 'YouTube' },
                { icon: TwitterIcon, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/50 hover:shadow-glow-sm transition-all duration-200"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-text-secondary text-sm hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-secondary text-xs text-center sm:text-left">
            © 2025 FORGE FITNESS. Dibuat untuk tujuan edukasi dan portofolio.
          </p>
          <p className="text-text-secondary text-xs flex items-center gap-1">
            Informasi di situs ini bukan pengganti saran medis profesional.{' '}
            <Link to="/penafian" className="text-accent hover:underline">
              Baca Penafian
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
