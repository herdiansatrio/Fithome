import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll ke atas setiap ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg-primary text-text-primary selection:bg-accent selection:text-bg-primary">
      {/* Skip to Content for Screen Readers & Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-accent focus:text-bg-primary focus:font-heading focus:font-bold focus:rounded-xl focus:shadow-glow focus:outline-none"
      >
        Lewati ke konten utama
      </a>

      <Navbar />
      <main className="flex-1 pt-16" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
