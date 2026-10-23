import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Menu, UserRound, X } from 'lucide-react';
import { auth } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

/**
 * Nav items: setiap item punya:
 *   - to    : path halaman (untuk user yang sudah login)
 *   - hash  : id section di landing page (untuk user belum login / browse section)
 *   - label : teks tampilan
 */
const navItems = [
  { to: '/',           hash: 'beranda',    label: 'Beranda',    publicOnly: true },
  { to: '/latihan',    hash: 'latihan',    label: 'Latihan' },
  { to: '/program',    hash: 'program',    label: 'Program' },
  { to: '/kalkulator', hash: 'kalkulator', label: 'Kalkulator' },
  { to: '/nutrisi',    hash: 'nutrisi',    label: 'Nutrisi' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const isHome = pathname === '/';

  // Section aktif saat di landing page (default 'beranda' atau sesuai URL hash)
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#', '');
      if (navItems.some((n) => n.hash === h)) return h;
    }
    return 'beranda';
  });

  const isManualScrollRef = useRef(false);
  const manualScrollTimeoutRef = useRef(null);

  // Scroll spy: memantau section mana yang sedang dilihat di landing page
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (!isHome) return;
      if (isManualScrollRef.current) return;

      // Paling atas → selalu beranda
      if (window.scrollY < 80) {
        setActiveSection('beranda');
        return;
      }

      // Mendekati dasar halaman → aktifkan section terakhir
      const isNearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isNearBottom) {
        setActiveSection('nutrisi');
        return;
      }

      // Deteksi section yang sedang melewati garis pandang (140px dari top)
      const scrollOffset = 140;
      let current = 'beranda';

      for (const item of navItems) {
        const el = document.getElementById(item.hash);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= scrollOffset) {
            current = item.hash;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
    };
  }, [isHome]);

  // Handle navigasi via URL hash misal /#program
  useEffect(() => {
    if (isHome && hash) {
      const target = hash.replace('#', '');
      if (navItems.some((n) => n.hash === target)) {
        setActiveSection(target);
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [hash, isHome]);

  // Tutup mobile menu saat ganti halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    navigate('/');
  };

  /**
   * Klik item navigasi:
   * - User sudah login     → navigate ke halaman fitur
   * - User belum login,
   *   sedang di beranda    → smooth scroll ke section & stay aktif di section tsb
   * - User belum login,
   *   di halaman lain      → navigate ke beranda + scroll setelah mount
   */
  const handleNavClick = (item) => {
    setIsOpen(false);

    // Item beranda: selalu ke /
    if (item.publicOnly) {
      setActiveSection('beranda');
      if (isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }

    if (user) {
      navigate(item.to);
      return;
    }

    // Belum login: stay di section yang dipilih & smooth scroll
    setActiveSection(item.hash);
    isManualScrollRef.current = true;
    if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 900);

    if (isHome) {
      const el = document.getElementById(item.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigasi ke beranda dengan hash, scroll setelah halaman load
      navigate(`/#${item.hash}`);
      setTimeout(() => {
        const el = document.getElementById(item.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  /** Cek apakah item sedang "aktif" secara visual */
  const isItemActive = (item) => {
    if (isHome) {
      return activeSection === item.hash;
    }
    if (item.publicOnly) {
      return pathname === '/';
    }
    return pathname.startsWith(item.to);
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
        {/* gap-x: md=16px (mepet tapi readable), lg=32px (lega) */}
        <div className="flex items-center h-16 gap-4 md:gap-6 lg:gap-8">

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={() => {
              if (isHome) {
                setActiveSection('beranda');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex shrink-0 items-center"
            aria-label="FitHome - Halaman Beranda"
          >
            <Logo size="md" />
          </Link>

          {/* ── Desktop Nav (tengah, tumbuh mengisi ruang) ── */}
          <nav
            className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-2"
            aria-label="Navigasi utama"
          >
            {navItems.map((item) => {
              const active = isItemActive(item);
              const locked = !user && !item.publicOnly;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`nav-link px-2 lg:px-3 text-xs lg:text-sm whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'active text-accent'
                      : locked
                        ? 'opacity-70 hover:opacity-100'
                        : ''
                  }`}
                  title={locked ? `Login untuk mengakses ${item.label}` : item.label}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ── Desktop CTA (kanan, shrink-0 agar tidak diperas) ── */}
          <div className="hidden md:flex shrink-0 items-center gap-2 lg:gap-3">
            {user ? (
              <>
                <Link
                  to="/profil"
                  className="btn-ghost max-w-36 lg:max-w-44 truncate text-xs lg:text-sm py-2 px-3 lg:px-4"
                  aria-label="Buka profil"
                >
                  <UserRound size={15} />
                  <span className="truncate">{user.displayName || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-xs lg:text-sm py-2 px-3 lg:px-4"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-xs lg:text-sm py-2 px-3 lg:px-4">Masuk</Link>
                <Link to="/register" className="btn-primary text-xs lg:text-sm py-2 px-4 lg:px-5">Daftar Gratis</Link>
              </>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-bg-secondary transition-colors"
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
            {navItems.map((item) => {
              const active = isItemActive(item);
              const locked = !user && !item.publicOnly;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`flex w-full items-center justify-between px-3 py-2.5 rounded-lg font-body text-sm transition-all duration-200 ${
                    active
                      ? 'text-accent bg-accent/15 font-semibold'
                      : locked
                        ? 'text-text-muted hover:bg-bg-secondary hover:text-text-secondary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                    {item.label}
                  </span>
                  {locked && (
                    <span className="text-[10px] font-semibold text-text-muted bg-bg-card border border-border rounded px-1.5 py-0.5">
                      Login
                    </span>
                  )}
                </button>
              );
            })}

            <div className="mt-3 pt-3 border-t border-border">
              {user ? (
                <div className="space-y-2">
                  <Link to="/profil" onClick={() => setIsOpen(false)} className="btn-secondary w-full justify-center text-sm">
                    <UserRound size={15} />Profil saya
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary w-full justify-center text-sm">Keluar</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-ghost w-full justify-center text-sm">
                    Masuk
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full justify-center text-sm">
                    Daftar Gratis
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
