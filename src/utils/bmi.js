// bmi.js — Utility kalkulasi BMI

/**
 * Hitung nilai BMI
 * @param {number} weightKg - berat badan dalam kg
 * @param {number} heightCm - tinggi badan dalam cm
 * @returns {number} nilai BMI
 */
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Dapatkan kategori BMI untuk orang dewasa
 * @param {number} bmi
 * @returns {{ category: string, color: string, description: string }}
 */
export function getBMICategory(bmi) {
  if (bmi === null || bmi === undefined) return null;

  if (bmi < 18.5) {
    return {
      category: 'Berat Badan Kurang',
      categoryEn: 'Underweight',
      color: '#3B82F6',
      colorClass: 'text-blue-400',
      bgClass: 'bg-blue-400/20',
      borderClass: 'border-blue-400/40',
      description: 'BMI di bawah 18,5. Pertimbangkan untuk meningkatkan asupan kalori dan konsultasi dengan tenaga kesehatan.',
      percentage: Math.min((bmi / 40) * 100, 100),
      position: (bmi / 40) * 100,
    };
  } else if (bmi < 25) {
    return {
      category: 'Berat Badan Normal',
      categoryEn: 'Normal Weight',
      color: '#B6FF00',
      colorClass: 'text-accent',
      bgClass: 'bg-accent/20',
      borderClass: 'border-accent/40',
      description: 'BMI dalam rentang normal (18,5–24,9). Pertahankan pola makan sehat dan aktivitas fisik teratur.',
      percentage: Math.min((bmi / 40) * 100, 100),
      position: (bmi / 40) * 100,
    };
  } else if (bmi < 30) {
    return {
      category: 'Kelebihan Berat Badan',
      categoryEn: 'Overweight',
      color: '#F59E0B',
      colorClass: 'text-warning',
      bgClass: 'bg-warning/20',
      borderClass: 'border-warning/40',
      description: 'BMI antara 25–29,9. Aktivitas fisik teratur dan pola makan seimbang dapat membantu mencapai berat ideal.',
      percentage: Math.min((bmi / 40) * 100, 100),
      position: (bmi / 40) * 100,
    };
  } else if (bmi < 35) {
    return {
      category: 'Obesitas Kelas I',
      categoryEn: 'Obesity Class I',
      color: '#EF4444',
      colorClass: 'text-error',
      bgClass: 'bg-error/20',
      borderClass: 'border-error/40',
      description: 'BMI antara 30–34,9. Konsultasikan dengan dokter untuk program penurunan berat badan yang aman dan terstruktur.',
      percentage: Math.min((bmi / 40) * 100, 100),
      position: (bmi / 40) * 100,
    };
  } else {
    return {
      category: 'Obesitas Kelas II+',
      categoryEn: 'Obesity Class II+',
      color: '#7F1D1D',
      colorClass: 'text-red-800',
      bgClass: 'bg-red-900/20',
      borderClass: 'border-red-800/40',
      description: 'BMI 35 ke atas. Sangat disarankan berkonsultasi dengan dokter atau tenaga medis profesional.',
      percentage: Math.min((bmi / 40) * 100, 100),
      position: Math.min((bmi / 40) * 100, 95),
    };
  }
}

/**
 * Validasi input BMI
 */
export function validateBMIInputs(weight, height) {
  const errors = {};
  if (!weight || isNaN(weight)) errors.weight = 'Masukkan berat badan yang valid.';
  else if (weight < 10 || weight > 500) errors.weight = 'Berat badan harus antara 10–500 kg.';

  if (!height || isNaN(height)) errors.height = 'Masukkan tinggi badan yang valid.';
  else if (height < 50 || height > 300) errors.height = 'Tinggi badan harus antara 50–300 cm.';

  return errors;
}
