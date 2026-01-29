# DevTrack - Docker Setup

Aplikasi DevTrack menggunakan Docker untuk memudahkan deployment dengan 3 container:
- **PostgreSQL** - Database (port 5432)
- **Laravel Backend** - API Server (port 8000)
- **Next.js Frontend** - Web Application (port 3000)

## Prerequisites

- Docker Desktop terinstall
- Docker Compose terinstall

## Quick Start

### 1. Generate Laravel Application Key

Sebelum menjalankan, generate APP_KEY untuk Laravel:

```bash
cd be-devtrack
php artisan key:generate
```

Copy nilai APP_KEY dari `.env` dan paste ke `docker-compose.yml` di bagian `backend.environment.APP_KEY`

### 2. Build dan Jalankan Containers

Dari root directory project:

```bash
docker-compose up -d --build
```

Command ini akan:
- Build image untuk backend dan frontend
- Pull image PostgreSQL
- Membuat network `devtrack-network`
- Membuat volume `postgres_data` untuk persistence database
- Menjalankan semua containers

### 3. Setup Database

Jalankan migrations dan seeders:

```bash
# Masuk ke container backend
docker exec -it devtrack-backend bash

# Jalankan migrations
php artisan migrate --force

# Jalankan seeders (opsional - untuk data dummy)
php artisan db:seed

# Keluar dari container
exit
```

### 4. Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **PostgreSQL**: localhost:5432

### Login Credentials (setelah seeding)

**Manager:**
- Email: manager@test.com
- Password: password123

**Engineer:**
- Email: engineer1@test.com
- Password: password123

## Docker Commands

### Melihat Logs

```bash
# Semua containers
docker-compose logs -f

# Backend saja
docker-compose logs -f backend

# Frontend saja
docker-compose logs -f frontend

# Database saja
docker-compose logs -f postgres
```

### Stop Containers

```bash
docker-compose down
```

### Stop dan Hapus Volumes (Reset Database)

```bash
docker-compose down -v
```

### Restart Service Tertentu

```bash
# Restart backend
docker-compose restart backend

# Restart frontend
docker-compose restart frontend
```

### Rebuild Setelah Code Changes

```bash
# Rebuild semua
docker-compose up -d --build

# Rebuild backend saja
docker-compose up -d --build backend

# Rebuild frontend saja
docker-compose up -d --build frontend
```

## Development vs Production

### Development (Local)

Untuk development lokal tanpa Docker:

**Backend:**
```bash
cd be-devtrack
php artisan serve
```

**Frontend:**
```bash
cd fe-devtrack
npm run dev
```

### Production (Docker)

Gunakan docker-compose.yml yang sudah disediakan.

## Troubleshooting

### Port Already in Use

Jika port 3000, 8000, atau 5432 sudah digunakan, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Ubah 8000 ke 8080 untuk backend
  - "3001:3000"  # Ubah 3000 ke 3001 untuk frontend
  - "5433:5432"  # Ubah 5432 ke 5433 untuk postgres
```

### Database Connection Error

Pastikan PostgreSQL container sudah ready sebelum backend start. Health check sudah dikonfigurasi untuk ini.

Jika tetap error:

```bash
# Restart containers
docker-compose restart

# Atau rebuild
docker-compose up -d --build
```

### Permission Denied (Storage)

```bash
# Masuk ke container backend
docker exec -it devtrack-backend bash

# Fix permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

exit
```

### Clear Cache

```bash
docker exec -it devtrack-backend php artisan cache:clear
docker exec -it devtrack-backend php artisan config:clear
docker exec -it devtrack-backend php artisan route:clear
docker exec -it devtrack-backend php artisan view:clear
```

## Environment Variables

### Backend (.env atau docker-compose.yml)

- `DB_HOST=postgres` - Hostname database (nama service di docker-compose)
- `DB_PORT=5432`
- `DB_DATABASE=devtrack`
- `DB_USERNAME=devtrack`
- `DB_PASSWORD=devtrack123`

### Frontend (.env.production)

- `NEXT_PUBLIC_API_URL=http://localhost:8000/api` - URL backend API

## Database Backup & Restore

### Backup

```bash
docker exec devtrack-postgres pg_dump -U devtrack devtrack > backup.sql
```

### Restore

```bash
cat backup.sql | docker exec -i devtrack-postgres psql -U devtrack devtrack
```

## Struktur Docker

```
devtrack/
├── docker-compose.yml          # Orchestration semua services
├── be-devtrack/
│   ├── Dockerfile             # Image untuk Laravel
│   ├── .dockerignore
│   ├── .env.docker            # Environment variables untuk Docker
│   └── docker/
│       ├── nginx.conf         # Nginx configuration
│       └── supervisord.conf   # Supervisor untuk PHP-FPM + Nginx
└── fe-devtrack/
    ├── Dockerfile             # Multi-stage build untuk Next.js
    ├── .dockerignore
    └── .env.production        # Environment variables untuk production
```

## Production Deployment

Untuk production di server:

1. Update `APP_ENV=production` dan `APP_DEBUG=false`
2. Update `NEXT_PUBLIC_API_URL` dengan domain backend yang sebenarnya
3. Gunakan SSL/TLS (tambahkan reverse proxy seperti Traefik atau Nginx)
4. Update password database di `docker-compose.yml`
5. Setup backup otomatis untuk volume PostgreSQL

## Network

Semua containers terhubung di network `devtrack-network` untuk komunikasi internal.

- Backend → PostgreSQL: `postgres:5432`
- Frontend → Backend: `http://backend:80` (internal) atau `http://localhost:8000` (external)
