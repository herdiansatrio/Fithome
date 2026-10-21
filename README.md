# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Menyiapkan login Firebase

Login dan pendaftaran menggunakan email/password melalui Firebase Authentication. Agar fitur bisa digunakan:

1. Buat project di [Firebase Console](https://console.firebase.google.com/) dan tambahkan aplikasi Web.
2. Di **Authentication → Sign-in method**, aktifkan **Email/Password**.
3. Salin `.env.example` menjadi `.env`, lalu isi nilai `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, dan `VITE_FIREBASE_APP_ID` dari konfigurasi aplikasi Web Firebase.
4. Di **Authentication → Settings → Authorized domains**, pastikan domain pengembangan/produksi ditambahkan.
5. Jalankan ulang server Vite setelah menyimpan `.env`.

Jangan commit file `.env`. Sampai konfigurasi Firebase diisi, form login akan dinonaktifkan dan menampilkan petunjuk konfigurasi.
