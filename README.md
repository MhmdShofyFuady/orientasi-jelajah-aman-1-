# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Dokumentasi Status Data & Offline-First (Pertemuan 7)

- **Cache-Segar vs Cache-Basi**: Cache-segar adalah salinan data lokal yang umurnya masih di bawah batas TTL (30 menit), sehingga aplikasi langsung menggunakannya tanpa perlu memanggil internet. Sebaliknya, cache-basi (*stale*) adalah data lokal yang sudah melewati 30 menit atau gagal diperbarui karena koneksi internet mati/offline, namun tetap ditampilkan sebagai cadangan terpercaya agar pengguna tidak melihat layar kosong.
- **First-run Offline**: Merupakan kondisi saat aplikasi pertama kali dibuka dalam keadaan tanpa internet dan belum pernah ada cache tersimpan sama sekali di SQLite, sehingga aplikasi menampilkan pesan error informatif disertai tombol "Coba Lagi" tanpa crash.
- **Pentingnya Label Status Data**: Label status data (seperti "Data terbaru dari internet", "Data tersimpan (masih segar)", dan "Mode offline - data tersimpan mungkin sudah usang") sangat penting untuk menjaga kejujuran dan transparansi informasi kepada pengguna, sehingga pengguna mengetahui secara pasti seberapa mutakhir data cuaca yang sedang mereka lihat sebelum mengambil keputusan perjalanan.
