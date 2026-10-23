import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Bungkus route yang memerlukan autentikasi.
 * - Jika masih loading auth state: tampilkan layar loading.
 * - Jika belum login: redirect ke /login (simpan halaman asal).
 * - Jika sudah login: render children.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent" />
          <p className="text-sm text-text-secondary">Memeriksa sesi…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Simpan tujuan asal agar setelah login bisa diarahkan kembali
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
