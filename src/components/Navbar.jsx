import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Menu, UserRound, X, Zap } from 'lucide-react';
import { auth } from '../utils/firebase';

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/latihan', label: 'Latihan' },
  { to: '/program', label: 'Program' },
  { to: '/kalkulator', label: 'Kalkulator' },
  { to: '/nutrisi', label: 'Nutrisi' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleMulaiLatihan = () => {
    setIsOpen(false);
    navigate('/latihan');
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    setIsOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-dark border-b border-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="FORGE FITNESS - Halaman Beranda"
          >
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <Zap size={18} className="text-bg-primary fill-bg-primary" />
            </div>
            <span className="font-heading font-black text-lg tracking-tight">
              FORGE<span className="text-accent">FITNESS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navigasi utama">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profil" className="btn-ghost max-w-44 truncate text-sm" aria-label="Buka profil"><UserRound size={16} />{user.displayName || user.email}</Link>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">Keluar</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Masuk</Link>
                <button onClick={handleMulaiLatihan} className="btn-primary text-sm py-2 px-5">Mulai Latihan</button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={22} className="text-text-primary" />
            ) : (
              <Menu size={22} className="text-text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-dark border-t border-border animate-slide-down">
          <nav className="container-main py-4 flex flex-col gap-1" aria-label="Navigasi mobile">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg font-body text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-border">
              {user ? (
                <div className="space-y-2">
                  <Link to="/profil" onClick={() => setIsOpen(false)} className="btn-secondary w-full justify-center text-sm"><UserRound size={15} />Profil saya</Link>
                  <button onClick={handleLogout} className="btn-secondary w-full justify-center text-sm">Keluar</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary w-full justify-center text-sm">Masuk / Daftar</Link>
                  <button onClick={handleMulaiLatihan} className="btn-primary w-full justify-center text-sm">Mulai Latihan</button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
