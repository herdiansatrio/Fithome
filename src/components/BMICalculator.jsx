import { useState } from 'react';
import { calculateBMI, getBMICategory, validateBMIInputs } from '../utils/bmi';
import { AlertCircle } from 'lucide-react';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleCalculate = () => {
    const validationErrors = validateBMIInputs(Number(weight), Number(height));
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const bmi = calculateBMI(Number(weight), Number(height));
    const category = getBMICategory(bmi);
    setResult({ bmi, category });
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setResult(null);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weight */}
        <div>
          <label htmlFor="bmi-weight" className="block text-sm font-medium text-text-primary mb-2">
            Berat Badan (kg)
          </label>
          <input
            id="bmi-weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Contoh: 70"
            className={`input-field ${errors.weight ? 'border-error' : ''}`}
            min="10"
            max="500"
            step="0.1"
          />
          {errors.weight && (
            <p className="mt-1.5 text-xs text-error flex items-center gap-1">
              <AlertCircle size={11} /> {errors.weight}
            </p>
          )}
        </div>

        {/* Height */}
        <div>
          <label htmlFor="bmi-height" className="block text-sm font-medium text-text-primary mb-2">
            Tinggi Badan (cm)
          </label>
          <input
            id="bmi-height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Contoh: 170"
            className={`input-field ${errors.height ? 'border-error' : ''}`}
            min="50"
            max="300"
          />
          {errors.height && (
            <p className="mt-1.5 text-xs text-error flex items-center gap-1">
              <AlertCircle size={11} /> {errors.height}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={handleCalculate} className="btn-primary flex-1 justify-center">
          Hitung BMI
        </button>
        {result && (
          <button onClick={handleReset} className="btn-secondary px-4">
            Reset
          </button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl border p-5 ${result.category.bgClass} ${result.category.borderClass} animate-slide-up`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm mb-1">Nilai BMI Kamu</p>
              <p className={`font-heading font-black text-5xl tabular-nums ${result.category.colorClass}`}>
                {result.bmi.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <span className={`badge border text-sm px-3 py-1.5 ${result.category.bgClass} ${result.category.colorClass} ${result.category.borderClass}`}>
                {result.category.category}
              </span>
            </div>
          </div>

          {/* BMI Scale Bar */}
          <div className="mb-4">
            <div className="relative h-3 rounded-full overflow-hidden bg-bg-primary/40 mb-1">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                style={{
                  width: `${result.category.position}%`,
                  backgroundColor: result.category.color,
                }}
              />
              {/* Marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-lg transition-all duration-700"
                style={{
                  left: `calc(${result.category.position}% - 6px)`,
                  borderColor: result.category.color,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>Kurang &lt;18.5</span>
              <span>Normal 18.5–24.9</span>
              <span>Lebih 25–29.9</span>
              <span>Obesitas 30+</span>
            </div>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed">
            {result.category.description}
          </p>

          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-text-secondary text-xs">
              ⚠️ BMI adalah alat skrining umum, bukan diagnosis medis. Tidak mengukur lemak tubuh
              secara langsung. Konsultasikan dengan tenaga kesehatan untuk evaluasi yang lebih lengkap.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
