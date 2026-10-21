import { Link } from 'react-router-dom';
import { Home, Dumbbell, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
          <Dumbbell size={40} className="animate-bounce" />
        </div>
        <span className="text-accent font-semibold text-sm tracking-wider uppercase">404 Error</span>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight mt-2 mb-4 text-text-primary">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Yuk kembali latihan dan bangun fisik idamanmu!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home size={18} />
            Kembali ke Beranda
          </Link>
          <Link to="/latihan" className="btn-secondary flex items-center justify-center gap-2">
            <Dumbbell size={18} />
            Jelajahi Latihan
          </Link>
        </div>
      </div>
    </div>
  );
}
