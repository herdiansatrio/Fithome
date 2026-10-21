import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calculator as CalculatorIcon, Flame } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import BMICalculator from '../components/BMICalculator';
import CalorieCalculator from '../components/CalorieCalculator';

const tabs = [
  { id: 'bmi', label: 'Kalkulator BMI', icon: CalculatorIcon },
  { id: 'calorie', label: 'Kebutuhan Kalori', icon: Flame },
];

export default function Calculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'bmi');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'calorie' || tab === 'bmi') setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  return (
    <div className="section">
      <div className="container-main max-w-2xl">
        <SectionHeading
          label="Tools Kebugaran"
          title={<>Kalkulator <span className="text-accent">Kebugaran</span></>}
          subtitle="Hitung BMI dan estimasi kebutuhan kalori harianmu berdasarkan data aktual."
          centered
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-bg-secondary p-1.5 rounded-xl border border-border" role="tablist">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => handleTabChange(id)}
              id={`tab-${id}`}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-heading font-semibold transition-all duration-200 ${
                activeTab === id
                  ? 'bg-accent text-bg-primary shadow-glow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Calculator Panel */}
        <div className="card p-6 md:p-8">
          {activeTab === 'bmi' && (
            <div role="tabpanel" aria-labelledby="tab-bmi">
              <h2 className="font-heading font-bold text-lg text-text-primary mb-1">Body Mass Index (BMI)</h2>
              <p className="text-text-secondary text-sm mb-6">
                Hitung indeks massa tubuhmu berdasarkan berat dan tinggi badan.
              </p>
              <BMICalculator />
            </div>
          )}
          {activeTab === 'calorie' && (
            <div role="tabpanel" aria-labelledby="tab-calorie">
              <h2 className="font-heading font-bold text-lg text-text-primary mb-1">BMR & TDEE (Mifflin–St Jeor)</h2>
              <p className="text-text-secondary text-sm mb-6">
                Estimasi kebutuhan kalori harian berdasarkan usia, berat, tinggi, dan tingkat aktivitas.
              </p>
              <CalorieCalculator />
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-warning/5 border border-warning/20 rounded-xl p-4">
          <p className="text-text-secondary text-xs leading-relaxed">
            ⚠️ Semua kalkulasi merupakan estimasi berdasarkan formula umum. Kebutuhan setiap individu
            dapat berbeda berdasarkan kondisi kesehatan, metabolisme, dan faktor lainnya. Informasi
            ini bukan pengganti konsultasi dengan dokter atau ahli gizi.
          </p>
        </div>
      </div>
    </div>
  );
}
