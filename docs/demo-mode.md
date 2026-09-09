# Demo Mode & Customer Simulator

## Menjalankan Demo Mode

WALEAD AI dilengkapi dengan **Demo Mode** siap pakai yang menginjeksi data realistis toko online Indonesia (Kopi Senja):

```bash
php artisan db:seed --class=DemoSeeder
```

### Akun Bawaan Demo:
- **Email:** `admin@walead.test`
- **Password:** `password`
- **Workspace:** `Kopi Senja`

## Menjalankan Customer Simulator

1. Login menggunakan akun demo.
2. Buka menu **Simulator** (`/simulator`).
3. Masukkan nama pelanggan dan pesan (contoh: *"Halo kak, sepatu Nike hitam ukuran 42 masih ada?"*).
4. Klik **Simulate Message**.
5. Buka menu **Dashboard**, **Inbox**, atau **AI Approvals** untuk melihat reaksi realtime dari sistem WALEAD AI.
