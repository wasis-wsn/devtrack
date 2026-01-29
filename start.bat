@echo off
REM DevTrack - Quick Start Script for Windows

echo Starting DevTrack Docker Setup...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    exit /b 1
)

REM Check if APP_KEY exists
cd be-devtrack
php artisan key:generate --force --no-interaction
cd ..

echo Building Docker containers...
docker-compose up -d --build

echo Waiting for database to be ready...
timeout /t 15 /nobreak >nul

echo Running database migrations...
docker exec devtrack-backend php artisan migrate --force

echo Seeding database with sample data...
docker exec devtrack-backend php artisan db:seed --force

echo.
echo DevTrack is ready!
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000/api
echo PostgreSQL: localhost:5432
echo.
echo Login Credentials:
echo   Manager: manager@test.com / password123
echo   Engineer: engineer1@test.com / password123
echo.
echo Run 'docker-compose logs -f' to view logs
echo Run 'docker-compose down' to stop
pause
