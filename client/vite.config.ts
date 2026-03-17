// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({

//   plugins: [react(), tailwindcss()],
//   base: '/', // Important: must be '/' for Vercel
//   server: {
//     port: 5173,
//     open: true,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//       },
//     },

// })

// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react';

// // export default defineConfig({
// //   plugins: [react()],
// //   base: '/', // Important: must be '/' for Vercel
// //   build: {
// //     outDir: 'dist',
// //     sourcemap: false
// //   }
// // });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   port: 5173,
  //   open: true,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //     },
  //   },
  // },
  // // Important for Vercel deployment
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Ensure assets are properly referenced
    assetsDir: 'assets',
  },
  // Base path - important for deployment
  base: '/',
});