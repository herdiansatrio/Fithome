import { useState } from 'react';
import { X, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ArticleCard from '../components/ArticleCard';
import { articles, articleCategories } from '../data/articles';

const categoryColors = {
  protein: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  carbs: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  fats: 'text-green-400 bg-green-400/10 border-green-400/30',
  hydration: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  recovery: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  warmup: 'text-accent bg-accent/10 border-accent/30',
};

export default function Nutrition() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filtered = articles.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

  const currentIdx = selectedArticle ? articles.findIndex((a) => a.id === selectedArticle.id) : -1;

  return (
    <div className="section">
      <div className="container-main">
        <SectionHeading
          label="Nutrisi & Pemulihan"
          title={<>Makan Cerdas, <span className="text-accent">Pulih Lebih Cepat</span></>}
          subtitle="Panduan edukasi nutrisi dan pemulihan untuk mendukung perjalanan kebugaran kamu. Ingat: kebutuhan setiap orang berbeda."
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter kategori artikel">
          {articleCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-xl border text-sm font-heading font-semibold transition-all duration-200 ${
                activeCategory === cat.value
                  ? 'bg-accent text-bg-primary border-accent shadow-glow-sm'
                  : 'bg-bg-card border-border text-text-secondary hover:border-accent/40 hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => setSelectedArticle(article)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary">Tidak ada artikel untuk kategori ini.</p>
          </div>
        )}

        {/* Medical Notice */}
        <div className="mt-12 bg-bg-card border border-border rounded-2xl p-6 text-center">
          <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">
            <strong className="text-text-primary">Catatan Penting:</strong> Semua informasi di halaman ini adalah panduan edukasi umum.
            Kebutuhan nutrisi setiap orang berbeda dan dipengaruhi oleh banyak faktor. Konsultasikan
            dengan ahli gizi atau dokter untuk rekomendasi yang dipersonalisasi sesuai kondisi kesehatan kamu.
          </p>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-bg-primary/90 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-bg-card border border-border rounded-2xl shadow-card">
            {/* Modal Header Image */}
            <div className="relative h-44 overflow-hidden rounded-t-2xl">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
              {/* Close */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-bg-primary/80 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-all"
                aria-label="Tutup artikel"
              >
                <X size={16} />
              </button>
              {/* Category badge */}
              <span className={`absolute bottom-3 left-4 badge border text-xs ${categoryColors[selectedArticle.category] || 'badge-neutral'}`}>
                {selectedArticle.categoryLabel}
              </span>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={13} className="text-text-secondary" />
                <span className="text-text-secondary text-xs">{selectedArticle.readTime} baca</span>
              </div>
              <h2 id="modal-title" className="font-heading font-black text-xl md:text-2xl text-text-primary mb-5 leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="space-y-5">
                {selectedArticle.content.map((section, i) => (
                  <div key={i}>
                    <h3 className="font-heading font-bold text-base text-text-primary mb-2">
                      {section.heading}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-5 border-t border-border">
                <button
                  onClick={() => currentIdx > 0 && setSelectedArticle(articles[currentIdx - 1])}
                  disabled={currentIdx <= 0}
                  className="btn-ghost text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Sebelumnya
                </button>
                <button
                  onClick={() => currentIdx < articles.length - 1 && setSelectedArticle(articles[currentIdx + 1])}
                  disabled={currentIdx >= articles.length - 1}
                  className="btn-ghost text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Berikutnya <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
