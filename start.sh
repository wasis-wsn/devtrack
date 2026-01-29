#!/bin/bash

# DevTrack - Quick Start Script

echo "🚀 Starting DevTrack Docker Setup..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if APP_KEY exists
if ! grep -q "APP_KEY=base64:" be-devtrack/.env 2>/dev/null; then
    echo "⚠️  APP_KEY not found. Generating..."
    cd be-devtrack
    php artisan key:generate
    cd ..
fi

# Get APP_KEY from .env
APP_KEY=$(grep "APP_KEY=" be-devtrack/.env | cut -d '=' -f2-)

if [ -z "$APP_KEY" ]; then
    echo "❌ Failed to get APP_KEY. Please generate it manually."
    exit 1
fi

echo "✅ APP_KEY found"

# Update docker-compose.yml with APP_KEY
sed -i.bak "s|APP_KEY: base64:YOUR_APP_KEY_HERE|APP_KEY: $APP_KEY|g" docker-compose.yml
rm docker-compose.yml.bak 2>/dev/null

echo "📦 Building Docker containers..."
docker-compose up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🗄️  Running database migrations..."
docker exec devtrack-backend php artisan migrate --force

echo "🌱 Seeding database with sample data..."
docker exec devtrack-backend php artisan db:seed

echo ""
echo "✅ DevTrack is ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000/api"
echo "🗄️  PostgreSQL: localhost:5432"
echo ""
echo "👤 Login Credentials:"
echo "   Manager: manager@test.com / password123"
echo "   Engineer: engineer1@test.com / password123"
echo ""
echo "📝 Run 'docker-compose logs -f' to view logs"
echo "🛑 Run 'docker-compose down' to stop"
