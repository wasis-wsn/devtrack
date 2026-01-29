# DevTrack API - Project & Issue Tracking Tool

Aplikasi Laravel API untuk mengelola proyek dan issue tracking dengan fitur role-based access (Manager dan Engineer).

## Fitur

### A. Project Management
- List semua proyek
- Lihat detail proyek (nama, manager, tanggal, issues)
- Status proyek (not started, in progress, finished)
- **Rules**:
  - Manager dapat melihat semua proyek miliknya
  - Engineer hanya dapat melihat proyek yang mereka ditugaskan untuk

### B. Issues Management
- List issues per proyek
- Lihat detail issue
- Create issue baru
- Update issue status

Issue fields:
- Type (bug/improvement)
- Status (open/in progress/done)
- Priority (1-5)
- Assignee
- Working hours

**Rules**:
- Hanya manager dapat membuat issue dan assign ke engineer
- Engineer yang ditugaskan dapat update status dan log working hours

### C. Basic Report
- Tampilkan semua issues untuk proyek terpilih
- Untuk setiap issue, tampilkan:
  - Assigned engineer
  - Issue type dan status
  - Total working hours

**Rules**:
- Manager dan Engineer dapat akses fitur ini

## Tech Stack

- **Backend**: Laravel 12
- **Database**: PostgreSQL/MySQL
- **API Documentation**: Swagger/Redoc
- **Authentication**: Laravel Sanctum (API tokens)
- **Frontend**: NextJS (optional)

## Setup

### Prerequisites
- PHP 8.2+
- Composer
- PostgreSQL/MySQL
- Node.js (untuk frontend)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd devtrack/be-devtrack
```

2. **Install dependencies**
```bash
composer install
```

3. **Setup environment**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database** di `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=devtrack
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run migrations**
```bash
php artisan migrate
```

6. **Seed test data**
```bash
php artisan db:seed
```

7. **Start server**
```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

## API Endpoints

### Authentication

#### Register
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "manager"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "1|abcdefg...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager"
  }
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

#### Get Current User
```http
GET /api/me
Authorization: Bearer {token}
```

### Projects

#### List Projects
```http
GET /api/projects
Authorization: Bearer {token}
```

#### Create Project (Manager only)
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "status": "in_progress",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

#### Get Project Details
```http
GET /api/projects/{id}
Authorization: Bearer {token}
```

#### Update Project (Manager only)
```http
PUT /api/projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Project Name",
  "status": "finished"
}
```

#### Delete Project (Manager only)
```http
DELETE /api/projects/{id}
Authorization: Bearer {token}
```

### Issues

#### List Issues for Project
```http
GET /api/projects/{projectId}/issues
Authorization: Bearer {token}
```

#### Create Issue (Manager only)
```http
POST /api/projects/{projectId}/issues
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Bug in login",
  "description": "Login button not working",
  "type": "bug",
  "priority": 3,
  "assigned_to": 2
}
```

#### Get Issue Details
```http
GET /api/issues/{id}
Authorization: Bearer {token}
```

#### Update Issue
- Manager: dapat update semua field
- Engineer: hanya dapat update status

```http
PUT /api/issues/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in_progress"
}
```

#### Delete Issue (Manager only)
```http
DELETE /api/issues/{id}
Authorization: Bearer {token}
```

### Work Logs

#### List Work Logs for Issue
```http
GET /api/issues/{issueId}/work-logs
Authorization: Bearer {token}
```

#### Add Work Log (Assigned Engineer only)
```http
POST /api/issues/{issueId}/work-logs
Authorization: Bearer {token}
Content-Type: application/json

{
  "hours": 4.5,
  "description": "Debugging and testing",
  "logged_at": "2024-01-15 10:00:00"
}
```

#### Get Work Log Details
```http
GET /api/work-logs/{id}
Authorization: Bearer {token}
```

#### Update Work Log
```http
PUT /api/work-logs/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "hours": 5,
  "description": "Updated description"
}
```

#### Delete Work Log
```http
DELETE /api/work-logs/{id}
Authorization: Bearer {token}
```

### Reports

#### Get Project Report
```http
GET /api/projects/{id}/report
Authorization: Bearer {token}
```

Response:
```json
{
  "project": {
    "id": 1,
    "name": "Project Name",
    "status": "in_progress"
  },
  "issues": [
    {
      "id": 1,
      "title": "Bug in login",
      "type": "bug",
      "status": "done",
      "priority": 3,
      "assigned_engineer": {
        "id": 2,
        "name": "Engineer Name",
        "email": "engineer@test.com"
      },
      "total_working_hours": 12.5,
      "work_logs": [
        {
          "id": 1,
          "hours": 4.5,
          "description": "Debugging",
          "logged_by": "Engineer Name",
          "logged_at": "2024-01-15T10:00:00Z"
        }
      ]
    }
  ],
  "total_hours": 25.5
}
```

## API Documentation

### Swagger UI
Dokumentasi API tersedia di:
- **Redoc UI**: `http://localhost:8000/api/documentation`

Swagger spec file terletak di `storage/api-docs/api-docs.yaml`

## Test Data

Setelah seeding, tersedia test users:

### Manager
- Email: `manager@test.com`
- Password: `password123`
- Role: `manager`

### Engineers
- Email: `engineer1@test.com` / `engineer2@test.com`
- Password: `password123`
- Role: `engineer`

## Database Schema

### Users Table
```
id, name, email, password, role, email_verified_at, created_at, updated_at
```

### Projects Table
```
id, name, description, manager_id (FK), status, start_date, end_date, created_at, updated_at
```

### Issues Table
```
id, title, description, project_id (FK), assigned_to (FK), type, status, priority, created_at, updated_at
```

### Work Logs Table
```
id, issue_id (FK), user_id (FK), hours, description, logged_at, created_at, updated_at
```

## Authorization Rules

### Roles
- **Manager**: Dapat membuat dan mengelola proyek, membuat dan assign issues
- **Engineer**: Dapat melihat proyek yang ditugaskan, update status issue, dan log working hours

### Resource Access
- **Projects**: Manager sees all owned, Engineer sees assigned
- **Issues**: Visible to manager (all in project) and assigned engineer
- **Work Logs**: Only creator/assigned engineer can manage

## Development

### Run Tests
```bash
php artisan test
```

### Generate API Docs
```bash
# Dokumentasi sudah dalam format YAML di storage/api-docs/api-docs.yaml
# Jika perlu update, edit file tersebut langsung
```

### Database Reset
```bash
php artisan migrate:reset
php artisan migrate
php artisan db:seed
```

## Docker Setup (Optional)

Untuk menjalankan dengan Docker:

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Migrate
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
```

## Troubleshooting

### Port 8000 sudah digunakan
```bash
php artisan serve --port=8001
```

### Database connection error
- Pastikan MySQL/PostgreSQL running
- Check `.env` database configuration
- Verify database credentials

### Token invalid/expired
- Login kembali untuk mendapatkan token baru
- Token disimpan di `personal_access_tokens` table

## Contributing

Silakan membuat PR untuk improvements!

## License

MIT

## Support

Email: support@devtrack.com
