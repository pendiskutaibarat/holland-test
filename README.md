# Holland Test - Tes Bakat Holland RIASEC

Platform tes kepribadian dan pemetaan peminatan/karir berdasarkan teori Holland RIASEC (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).

## Fitur

- **Dual-mode tes**: Peminatan (IPA/IPS/Bahasa) dan Karir
- **Wizard 8 langkah** dengan 90 pertanyaan RIASEC
- **Visualisasi radar chart** menggunakan Chart.js
- **Sistem badge/lencana karakter** untuk kombinasi kode tertentu
- **Ekspor hasil ke PDF** menggunakan html2pdf.js
- **Dashboard admin** dengan manajemen sesi dan kode unik
- **Autentikasi JWT** untuk admin

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Database**: PostgreSQL dengan Prisma 7
- **Auth**: JWT (jsonwebtoken)
- **Charts**: Chart.js + react-chartjs-2
- **PDF**: html2pdf.js
- **Password**: bcryptjs

## Prerequisites

- Node.js 20+
- PostgreSQL database

## Getting Started

1. **Clone dan install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Salin `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Atur variabel berikut di `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret untuk JWT token
- `ADMIN_EMAIL` - Email untuk admin default
- `ADMIN_PASSWORD` - Password untuk admin default

3. **Setup database**

```bash
npx prisma db push
npx prisma db seed
```

4. **Run development server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## Usage

### Admin

1. Buka `/admin/register` untuk registrasi
2. Login di `/admin/login`
3. Buat sesi tes baru dari dashboard
4. Bagikan kode sesi ke siswa

### Siswa

1. Kunjungi `/test/[code]` dengan kode sesi
2. Pilih mode (Peminatan atau Karir)
3. Ikuti wizard 8 langkah
4. Lihat hasil dengan radar chart dan rekomendasi

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Admin seed script
├── src/
│   ├── app/
│   │   ├── admin/         # Admin pages (login, register, dashboard)
│   │   ├── api/           # API routes
│   │   └── test/[code]/   # Student test page
│   ├── components/        # React components (Wizard, Charts, etc.)
│   ├── data/              # Questions, careers, badges data
│   └── lib/               # Auth, prisma client utilities
└── .env.example           # Environment template
```