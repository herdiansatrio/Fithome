# FORGE FITNESS

Aplikasi web kebugaran untuk menjelajahi gerakan latihan, mengikuti program workout, mencatat sesi, dan memantau profil. Dibangun dengan React, Vite, Tailwind CSS, dan Firebase Authentication.

## Fitur

- Katalog gerakan latihan dan detail panduannya.
- Program workout dengan pelacakan set, stopwatch sesi, dan timer istirahat.
- Riwayat sesi workout yang selesai dan disimpan.
- Kalkulator BMI dan kalori serta halaman nutrisi.
- Pendaftaran dan login menggunakan email/kata sandi Firebase.
- Halaman profil untuk melihat informasi akun, mengubah nama, dan melihat ringkasan serta riwayat latihan.

## Persyaratan

- Node.js dan npm.
- Project Firebase dengan aplikasi Web.

## Menjalankan aplikasi

1. Pasang dependensi:

	```bash
	npm install
	```

2. Buat file `.env` di folder utama project dan isi konfigurasi Firebase seperti bagian berikut.
3. Jalankan server pengembangan:

	```bash
	npm run dev
	```

4. Buka alamat lokal yang ditampilkan Vite di terminal.

Setelah mengubah `.env`, hentikan dan jalankan kembali server Vite supaya variabel konfigurasi dimuat ulang.

## Konfigurasi Firebase

Di Firebase Console, pilih **Project settings → General → Your apps**, lalu salin konfigurasi aplikasi Web ke file `.env` di folder utama:

```env
VITE_FIREBASE_API_KEY=nilai_apiKey
VITE_FIREBASE_AUTH_DOMAIN=project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=nilai_messagingSenderId
VITE_FIREBASE_APP_ID=nilai_appId
VITE_FIREBASE_MEASUREMENT_ID=nilai_measurementId
```

Aktifkan **Authentication → Sign-in method → Email/Password** di Firebase Console. Pastikan domain pengembangan dan domain produksi tercantum di **Authentication → Settings → Authorized domains**.

File `.env` berisi konfigurasi lokal dan tidak boleh di-commit. Variabel yang diawali `VITE_` akan tersedia di bundle browser; jangan menyimpan kata sandi, token privat, atau rahasia server di sana. Keamanan data Firebase perlu diatur melalui Firebase Authentication dan aturan keamanan layanan yang digunakan.

## Penggunaan profil dan riwayat

- Buka `/login` untuk masuk atau membuat akun.
- Setelah masuk, gunakan menu **Profil Saya** atau kunjungi `/profil`.
- Nama profil diperbarui di Firebase Authentication.
- Riwayat sesi disimpan di `localStorage` browser dan dipisahkan berdasarkan akun pada perangkat tersebut. Riwayat ini tidak disinkronkan ke cloud atau perangkat lain.
- Untuk mencatat sesi, selesaikan workout, lalu pilih **Simpan Sesi ke Riwayat**.

## Perintah

```bash
npm run dev      # Menjalankan server pengembangan
npm run build    # Membuat build produksi di dist/
npm run preview  # Melihat build produksi secara lokal
npm run lint     # Menjalankan Oxlint
```

## Teknologi

- React 19 dan React Router
- Vite
- Tailwind CSS 3
- Firebase Authentication dan Firebase Analytics
- Lucide React
