// calories.js — Utility kalkulasi BMR & TDEE (Mifflin-St Jeor)

/**
 * Hitung BMR menggunakan rumus Mifflin-St Jeor
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @param {'male' | 'female'} gender
 * @returns {number} BMR dalam kcal/hari
 */
export function calculateBMR(weightKg, heightCm, age, gender) {
  if (!weightKg || !heightCm || !age || !gender) return null;

  // Mifflin-St Jeor Equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  if (gender === 'male') {
    return base + 5;
  } else {
    return base - 161;
  }
}

export const activityLevels = [
  {
    value: 1.2,
    label: 'Sedentari',
    description: 'Tidak aktif atau sangat sedikit olahraga',
    example: 'Kerja kantoran, jarang bergerak',
  },
  {
    value: 1.375,
    label: 'Ringan',
    description: 'Olahraga ringan 1–3 hari/minggu',
    example: 'Jalan kaki ringan, yoga',
  },
  {
    value: 1.55,
    label: 'Moderat',
    description: 'Olahraga moderat 3–5 hari/minggu',
    example: 'Latihan di rumah seperti program ini',
  },
  {
    value: 1.725,
    label: 'Aktif',
    description: 'Olahraga berat 6–7 hari/minggu',
    example: 'Latihan intensitas tinggi setiap hari',
  },
  {
    value: 1.9,
    label: 'Sangat Aktif',
    description: 'Olahraga sangat berat atau pekerjaan fisik berat',
    example: 'Atlet, pekerja konstruksi',
  },
];

/**
 * Hitung TDEE dari BMR dan faktor aktivitas
 * @param {number} bmr
 * @param {number} activityFactor
 * @returns {number}
 */
export function calculateTDEE(bmr, activityFactor) {
  if (!bmr || !activityFactor) return null;
  return bmr * activityFactor;
}

/**
 * Hitung target kalori berdasarkan tujuan
 * @param {number} tdee
 * @param {'maintain' | 'loss' | 'gain'} goal
 * @returns {{ calories: number, surplus: number, label: string, description: string }}
 */
export function calculateGoalCalories(tdee, goal) {
  if (!tdee || !goal) return null;

  switch (goal) {
    case 'loss':
      return {
        calories: Math.round(tdee * 0.8), // Defisit 20%
        surplus: Math.round(tdee * 0.8 - tdee),
        label: 'Penurunan Berat Badan',
        description:
          'Estimasi kalori untuk defisit energi moderat. Penurunan berat badan sehat umumnya 0,5–1 kg per minggu.',
        color: '#3B82F6',
        colorClass: 'text-blue-400',
        bgClass: 'bg-blue-400/10',
      };
    case 'gain':
      return {
        calories: Math.round(tdee * 1.1), // Surplus 10%
        surplus: Math.round(tdee * 1.1 - tdee),
        label: 'Penambahan Berat Badan',
        description:
          'Estimasi kalori untuk surplus energi moderat. Penambahan massa otot yang sehat membutuhkan kesabaran dan latihan konsisten.',
        color: '#B6FF00',
        colorClass: 'text-accent',
        bgClass: 'bg-accent/10',
      };
    default:
      return {
        calories: Math.round(tdee),
        surplus: 0,
        label: 'Pemeliharaan Berat Badan',
        description:
          'Estimasi kalori untuk mempertahankan berat badan saat ini. Sesuaikan berdasarkan respons tubuh kamu.',
        color: '#F59E0B',
        colorClass: 'text-warning',
        bgClass: 'bg-warning/10',
      };
  }
}

/**
 * Validasi input kalkulator kalori
 */
export function validateCalorieInputs(inputs) {
  const errors = {};
  const { weight, height, age, gender, activity } = inputs;

  if (!weight || isNaN(weight)) errors.weight = 'Masukkan berat badan yang valid.';
  else if (weight < 10 || weight > 500) errors.weight = 'Berat badan harus antara 10–500 kg.';

  if (!height || isNaN(height)) errors.height = 'Masukkan tinggi badan yang valid.';
  else if (height < 50 || height > 300) errors.height = 'Tinggi badan harus antara 50–300 cm.';

  if (!age || isNaN(age)) errors.age = 'Masukkan usia yang valid.';
  else if (age < 10 || age > 120) errors.age = 'Usia harus antara 10–120 tahun.';

  if (!gender) errors.gender = 'Pilih jenis kelamin.';
  if (!activity) errors.activity = 'Pilih tingkat aktivitas.';

  return errors;
}
