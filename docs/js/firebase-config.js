// Tempel konfigurasi Web App dari Firebase Console di sini.
// Selama nilainya masih kosong, GlowGrid otomatis memakai mode demo localStorage.
export const firebaseConfig = {
  apiKey: "AIzaSyD53Y0xCgNkbqfAZAsl3m8i_I8xsDG6xPk",
  authDomain: "glowgrid-web.firebaseapp.com",
  projectId: "glowgrid-web",
  storageBucket: "glowgrid-web.firebasestorage.app",
  messagingSenderId: "869774929760",
  appId: "1:869774929760:web:595c0ae9d48447bb6ff805"
};

export const firebaseEnabled = Object.values(firebaseConfig).every(Boolean);
