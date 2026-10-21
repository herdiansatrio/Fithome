import { useState } from 'react';
import {
  calculateBMR,
  calculateTDEE,
  calculateGoalCalories,
  activityLevels,
  validateCalorieInputs,
} from '../utils/calories';
import { AlertCircle, Flame, Zap, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const goalOptions = [
  { value: 'loss', label: 'Turunkan Berat Badan', icon: TrendingDown, color: 'text-blue-400' },
  { value: 'maintain', label: 'Pertahankan Berat', icon: Minus, color: 'text-warning' },
  { value: 'gain', label: 'Tambah Massa Otot', icon: TrendingUp, color: 'text-accent' },
];

export default function CalorieCalculator() {
  const [form, setForm] = useState({ weight: '', height: '', age: '', gender: '', activity: '', goal: 'maintain' });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCalculate = () => {
    const validationErrors = validateCalorieInputs({
      weight: Number(form.weight),
      height: Number(form.height),
      age: Number(form.age),
      gender: form.gender,
      activity: form.activity,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const bmr = calculateBMR(Number(form.weight), Number(form.height), Number(form.age), form.gender);
    const tdee = calculateTDEE(bmr, Number(form.activity));
    const goalResult = calculateGoalCalories(tdee, form.goal);
    setResult({ bmr, tdee, goalResult });
  };

  const handleReset = () => {
    setForm({ weight: '', height: '', age: '', gender: '', activity: '', goal: 'maintain' });
    setResult(null);
    setErrors({});
  };

  const inputError = (field) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs text-error flex items-center gap-1">
        <AlertCircle size={11} /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weight */}
        <div>
          <label htmlFor="cal-weight" className="block text-sm font-medium text-text-primary mb-2">Berat Badan (kg)</label>
          <input id="cal-weight" type="number" value={form.weight} onChange={update('weight')} placeholder="Contoh: 70" className={`input-field ${errors.weight ? 'border-error' : ''}`} min="10" max="500" step="0.1" />
          {inputError('weight')}
        </div>
        {/* Height */}
        <div>
          <label htmlFor="cal-height" className="block text-sm font-medium text-text-primary mb-2">Tinggi Badan (cm)</label>
          <input id="cal-height" type="number" value={form.height} onChange={update('height')} placeholder="Contoh: 170" className={`input-field ${errors.height ? 'border-error' : ''}`} min="50" max="300" />
          {inputError('height')}
        </div>
        {/* Age */}
        <div>
          <label htmlFor="cal-age" className="block text-sm font-medium text-text-primary mb-2">Usia (tahun)</label>
          <input id="cal-age" type="number" value={form.age} onChange={update('age')} placeholder="Contoh: 25" className={`input-field ${errors.age ? 'border-error' : ''}`} min="10" max="120" />
          {inputError('age')}
        </div>
        {/* Gender */}
        <div>
          <label htmlFor="cal-gender" className="block text-sm font-medium text-text-primary mb-2">Jenis Kelamin</label>
          <select id="cal-gender" value={form.gender} onChange={update('gender')} className={`input-field ${errors.gender ? 'border-error' : ''}`}>
            <option value="" className="bg-bg-secondary">Pilih jenis kelamin</option>
            <option value="male" className="bg-bg-secondary">Laki-laki</option>
            <option value="female" className="bg-bg-secondary">Perempuan</option>
          </select>
          {inputError('gender')}
        </div>
      </div>

      {/* Activity Level */}
      <div>
        <label htmlFor="cal-activity" className="block text-sm font-medium text-text-primary mb-2">Tingkat Aktivitas</label>
        <select id="cal-activity" value={form.activity} onChange={update('activity')} className={`input-field ${errors.activity ? 'border-error' : ''}`}>
          <option value="" className="bg-bg-secondary">Pilih tingkat aktivitas</option>
          {activityLevels.map((level) => (
            <option key={level.value} value={level.value} className="bg-bg-secondary">
              {level.label} — {level.description}
            </option>
          ))}
        </select>
        {form.activity && (
          <p className="mt-1.5 text-xs text-text-secondary">
            Contoh: {activityLevels.find(l => l.value == form.activity)?.example}
          </p>
        )}
        {inputError('activity')}
      </div>

      {/* Goal Selection */}
      <div>
        <p className="block text-sm font-medium text-text-primary mb-3">Sasaran Kamu</p>
        <div className="grid grid-cols-3 gap-2">
          {goalOptions.map(({ value, label, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => setForm((prev) => ({ ...prev, goal: value }))}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-center ${
                form.goal === value
                  ? 'border-accent bg-accent/10 text-text-primary'
                  : 'border-border bg-bg-secondary text-text-secondary hover:border-accent/50'
              }`}
            >
              <Icon size={18} className={form.goal === value ? 'text-accent' : color} />
              <span className="text-xs font-medium leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={handleCalculate} className="btn-primary flex-1 justify-center">
          <Flame size={16} /> Hitung Kalori
        </button>
        {result && (
          <button onClick={handleReset} className="btn-secondary px-4">Reset</button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3 animate-slide-up">
          {/* BMR & TDEE */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-secondary rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} className="text-accent" />
                <p className="text-text-secondary text-xs uppercase tracking-wide font-medium">BMR</p>
              </div>
              <p className="font-heading font-black text-2xl text-accent tabular-nums">{Math.round(result.bmr).toLocaleString()}</p>
              <p className="text-text-secondary text-xs">kcal/hari (istirahat total)</p>
            </div>
            <div className="bg-bg-secondary rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={14} className="text-warning" />
                <p className="text-text-secondary text-xs uppercase tracking-wide font-medium">TDEE</p>
              </div>
              <p className="font-heading font-black text-2xl text-warning tabular-nums">{Math.round(result.tdee).toLocaleString()}</p>
              <p className="text-text-secondary text-xs">kcal/hari (dengan aktivitas)</p>
            </div>
          </div>

          {/* Goal Result */}
          <div className={`rounded-2xl border p-5 ${result.goalResult.bgClass} border-border`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-text-secondary text-xs mb-1">Target Kalori Harian</p>
                <p className={`font-heading font-black text-4xl tabular-nums ${result.goalResult.colorClass}`}>
                  {result.goalResult.calories.toLocaleString()}
                </p>
                <p className="text-text-secondary text-xs mt-0.5">kcal/hari</p>
              </div>
              <span className={`badge border text-sm ${result.goalResult.colorClass} border-current bg-transparent`}>
                {result.goalResult.label}
              </span>
            </div>

            {result.goalResult.surplus !== 0 && (
              <p className="text-text-secondary text-xs mb-2">
                {result.goalResult.surplus > 0 ? '▲' : '▼'} {Math.abs(result.goalResult.surplus)} kcal dari TDEE
              </p>
            )}

            <p className="text-text-secondary text-sm leading-relaxed">
              {result.goalResult.description}
            </p>

            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-text-secondary text-xs">
                ⚠️ Ini adalah estimasi menggunakan rumus Mifflin–St Jeor. Hasil aktual dapat berbeda tergantung faktor individual. Bukan pengganti saran ahli gizi atau dokter.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
