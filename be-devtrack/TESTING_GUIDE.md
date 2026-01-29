# DevTrack API - Verification & Testing Guide

## ✅ Setup Verification Checklist

Pastikan semua item berikut sudah selesai:

### Database & Migrations
- [ ] Database `devtrack` sudah dibuat
- [ ] Semua migrations sudah dijalankan (`php artisan migrate`)
- [ ] 8 migration files visible in database
- [ ] Seeders sudah dijalankan (`php artisan db:seed`)

Verifikasi dengan:
```bash
php artisan tinker
# Cek users
App\Models\User::count()  # Should return 3
```

### Dependencies
- [ ] Composer packages installed
- [ ] Sanctum installed dan configured
- [ ] L5-Swagger installed

Verifikasi:
```bash
composer show | grep -E "sanctum|l5-swagger"
```

### Environment
- [ ] `.env` file created dan configured
- [ ] `APP_KEY` generated (`php artisan key:generate`)
- [ ] Database credentials correct

Verifikasi:
```bash
php artisan config:show | grep APP
```

### Routes
- [ ] API routes registered
- [ ] Web routes registered (including /api/documentation)

Verifikasi:
```bash
php artisan route:list | grep -E "^api|^GET.*documentation"
```

## 🧪 Testing Workflow

### 1. Login & Get Token

**Method**: POST
**URL**: `http://localhost:8000/api/login`
**Headers**: 
- Content-Type: application/json

**Body**:
```json
{
  "email": "manager@test.com",
  "password": "password123"
}
```

**Expected Response** (201):
```json
{
  "token": "1|abc123def456...",
  "user": {
    "id": 1,
    "name": "Manager User",
    "email": "manager@test.com",
    "role": "manager",
    "created_at": "2026-01-29T...",
    "updated_at": "2026-01-29T..."
  }
}
```

**Save Token**: Gunakan token ini untuk semua request berikutnya

### 2. Verify Current User

**Method**: GET
**URL**: `http://localhost:8000/api/me`
**Headers**: 
- Authorization: Bearer {token}

**Expected Response** (200):
```json
{
  "id": 1,
  "name": "Manager User",
  "email": "manager@test.com",
  "role": "manager",
  ...
}
```

### 3. Create a Project

**Method**: POST
**URL**: `http://localhost:8000/api/projects`
**Headers**: 
- Authorization: Bearer {token}
- Content-Type: application/json

**Body**:
```json
{
  "name": "Website Redesign",
  "description": "Complete website redesign project",
  "status": "in_progress",
  "start_date": "2024-01-01",
  "end_date": "2024-06-30"
}
```

**Expected Response** (201):
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete website redesign project",
    "manager_id": 1,
    "status": "in_progress",
    "start_date": "2024-01-01",
    "end_date": "2024-06-30",
    "created_at": "2026-01-29T...",
    "updated_at": "2026-01-29T..."
  }
}
```

**Save Project ID**: Gunakan untuk membuat issues

### 4. List Projects

**Method**: GET
**URL**: `http://localhost:8000/api/projects`
**Headers**: 
- Authorization: Bearer {token}

**Expected Response** (200):
```json
[
  {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete website redesign project",
    "manager_id": 1,
    "status": "in_progress",
    "start_date": "2024-01-01",
    "end_date": "2024-06-30",
    "created_at": "2026-01-29T...",
    "updated_at": "2026-01-29T..."
  }
]
```

### 5. Create an Issue

**Method**: POST
**URL**: `http://localhost:8000/api/projects/{projectId}/issues`
**Headers**: 
- Authorization: Bearer {token}
- Content-Type: application/json

**Body**:
```json
{
  "title": "Fix login button style",
  "description": "Login button style doesn't match design",
  "type": "bug",
  "priority": 3,
  "assigned_to": 2
}
```

**Expected Response** (201):
```json
{
  "message": "Issue created successfully",
  "issue": {
    "id": 1,
    "title": "Fix login button style",
    "description": "Login button style doesn't match design",
    "project_id": 1,
    "assigned_to": 2,
    "type": "bug",
    "status": "open",
    "priority": 3,
    "created_at": "2026-01-29T...",
    "updated_at": "2026-01-29T..."
  }
}
```

**Save Issue ID**: Untuk logging work hours

### 6. Login as Engineer & Update Issue Status

**Method**: POST
**URL**: `http://localhost:8000/api/login`

**Body**:
```json
{
  "email": "engineer1@test.com",
  "password": "password123"
}
```

**Get Engineer Token** dan gunakan untuk:

**Method**: PUT
**URL**: `http://localhost:8000/api/issues/{issueId}`
**Headers**: 
- Authorization: Bearer {engineerToken}
- Content-Type: application/json

**Body**:
```json
{
  "status": "in_progress"
}
```

**Expected Response** (200):
```json
{
  "message": "Issue updated successfully",
  "issue": {
    "id": 1,
    "title": "Fix login button style",
    "description": "Login button style doesn't match design",
    "project_id": 1,
    "assigned_to": 2,
    "type": "bug",
    "status": "in_progress",
    "priority": 3,
    "created_at": "2026-01-29T...",
    "updated_at": "2026-01-29T..."
  }
}
```

### 7. Log Work Hours

**Method**: POST
**URL**: `http://localhost:8000/api/issues/{issueId}/work-logs`
**Headers**: 
- Authorization: Bearer {engineerToken}
- Content-Type: application/json

**Body**:
```json
{
  "hours": 4.5,
  "description": "Analyzed design and fixed button styles",
  "logged_at": "2024-01-29 14:30:00"
}
```

**Expected Response** (201):
```json
{
  "message": "Work log created successfully",
  "work_log": {
    "id": 1,
    "issue_id": 1,
    "user_id": 2,
    "hours": 4.5,
    "description": "Analyzed design and fixed button styles",
    "logged_at": "2024-01-29T14:30:00Z",
    "created_at": "2026-01-29T...",
    "updated_at": "2026-01-29T..."
  }
}
```

### 8. Get Issue Details with Work Logs

**Method**: GET
**URL**: `http://localhost:8000/api/issues/{issueId}`
**Headers**: 
- Authorization: Bearer {token}

**Expected Response** (200):
```json
{
  "id": 1,
  "title": "Fix login button style",
  "description": "Login button style doesn't match design",
  "project_id": 1,
  "assigned_to": 2,
  "type": "bug",
  "status": "in_progress",
  "priority": 3,
  "created_at": "2026-01-29T...",
  "updated_at": "2026-01-29T...",
  "assignee": {
    "id": 2,
    "name": "Engineer User 1",
    "email": "engineer1@test.com",
    ...
  },
  "work_logs": [
    {
      "id": 1,
      "issue_id": 1,
      "user_id": 2,
      "hours": 4.5,
      "description": "Analyzed design and fixed button styles",
      "logged_at": "2024-01-29T14:30:00Z",
      "created_at": "2026-01-29T...",
      "updated_at": "2026-01-29T..."
    }
  ],
  "total_hours": 4.5
}
```

### 9. Get Project Report

**Method**: GET
**URL**: `http://localhost:8000/api/projects/{projectId}/report`
**Headers**: 
- Authorization: Bearer {token}

**Expected Response** (200):
```json
{
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete website redesign project",
    "manager_id": 1,
    "status": "in_progress",
    "start_date": "2024-01-01",
    "end_date": "2024-06-30",
    "created_at": "2026-01-29T...",
    "updated_at": "2026-01-29T...",
    "manager": {
      "id": 1,
      "name": "Manager User",
      "email": "manager@test.com",
      ...
    }
  },
  "issues": [
    {
      "id": 1,
      "title": "Fix login button style",
      "description": "Login button style doesn't match design",
      "type": "bug",
      "status": "in_progress",
      "priority": 3,
      "assigned_engineer": {
        "id": 2,
        "name": "Engineer User 1",
        "email": "engineer1@test.com",
        ...
      },
      "total_working_hours": 4.5,
      "work_logs": [
        {
          "id": 1,
          "hours": 4.5,
          "description": "Analyzed design and fixed button styles",
          "logged_by": "Engineer User 1",
          "logged_at": "2024-01-29T14:30:00Z"
        }
      ]
    }
  ],
  "total_hours": 4.5
}
```

## 🔍 Error Testing

### Authorization Errors

#### Engineer tries to create project (Should fail)
**Method**: POST
**URL**: `http://localhost:8000/api/projects`
**Headers**: 
- Authorization: Bearer {engineerToken}
- Content-Type: application/json

**Body**:
```json
{
  "name": "Test Project",
  "status": "in_progress"
}
```

**Expected Response** (403):
```json
{
  "message": "Only managers can create projects"
}
```

#### Engineer tries to log work on unassigned issue (Should fail)
**Method**: POST
**URL**: `http://localhost:8000/api/issues/{unassignedIssueId}/work-logs`
**Headers**: 
- Authorization: Bearer {engineer2Token}
- Content-Type: application/json

**Body**:
```json
{
  "hours": 2,
  "description": "Test",
  "logged_at": "2024-01-29 14:30:00"
}
```

**Expected Response** (403):
```json
{
  "message": "Only assigned engineer can log work"
}
```

### Validation Errors

#### Invalid email format in register
**Method**: POST
**URL**: `http://localhost:8000/api/register`
**Headers**: 
- Content-Type: application/json

**Body**:
```json
{
  "name": "Test",
  "email": "invalid-email",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "manager"
}
```

**Expected Response** (422):
```json
{
  "message": "The email field must be a valid email address. (and other errors)",
  "errors": {
    "email": [
      "The email field must be a valid email address."
    ]
  }
}
```

#### Password mismatch in register
**Method**: POST
**URL**: `http://localhost:8000/api/register`

**Body**:
```json
{
  "name": "Test",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "different123",
  "role": "manager"
}
```

**Expected Response** (422):
```json
{
  "message": "The password confirmation does not match.",
  "errors": {
    "password": [
      "The password confirmation does not match."
    ]
  }
}
```

## 📊 Performance Testing

### Load Testing dengan Apache Bench
```bash
# Test /api/me endpoint
ab -n 100 -c 10 -H "Authorization: Bearer {token}" http://localhost:8000/api/me

# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json http://localhost:8000/api/login
```

### Load Testing dengan wrk
```bash
# Install wrk dari https://github.com/wg/wrk

# Test dengan script
wrk -t4 -c100 -d30s -s script.lua http://localhost:8000/api/me
```

## 🐛 Troubleshooting Common Issues

### Issue: SQLSTATE[HY000]: General error: 1215 Cannot add foreign key constraint
**Solution**: Pastikan MySQL version >= 5.7 dan foreign_key_checks enabled

### Issue: Token invalid/expired
**Solution**: Login kembali untuk mendapatkan token baru

### Issue: Port 8000 already in use
**Solution**: 
```bash
php artisan serve --port=8001
# atau kill process di port 8000
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows
```

### Issue: Database tidak terkoneksi
**Solution**: 
```bash
# Verifikasi database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'devtrack';"

# Atau create manual
mysql -u root -p -e "CREATE DATABASE devtrack;"
```

### Issue: Storage directory not writable
**Solution**:
```bash
# Pastikan permissions sudah benar
chmod -R 775 storage bootstrap/cache
# atau dengan Docker
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

## 📝 Logging & Debugging

### Enable Debug Mode
Edit `.env`:
```
APP_DEBUG=true
```

### View Logs
```bash
# Real-time logs
tail -f storage/logs/laravel.log

# atau
php artisan logs:tail
```

### Database Query Logging
Edit `.env`:
```
DB_QUERY_LOGGING=true
```

### Tinker Shell
```bash
php artisan tinker

# Test queries
App\Models\Project::with('manager', 'issues')->get()
```

## ✅ Final Checklist

- [ ] Database migrations ran successfully
- [ ] Test users created (manager + engineers)
- [ ] Can login and get token
- [ ] Can create project (as manager)
- [ ] Can create issue (as manager)
- [ ] Can update issue status (as engineer)
- [ ] Can log work hours (as engineer)
- [ ] Can view project report
- [ ] API documentation loads at /api/documentation
- [ ] All authorization rules working
- [ ] No validation errors on valid inputs

Setelah semua checklist selesai, API siap untuk production deployment! 🚀
