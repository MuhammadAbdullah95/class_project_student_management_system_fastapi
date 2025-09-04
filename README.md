# Student Management System (SMS)

A comprehensive FastAPI-based system for managing students, courses, and enrollments with JWT authentication and file upload capabilities.

## Features

- **Authentication**: JWT token-based authentication with admin and teacher roles
- **Student Management**: Full CRUD operations for student records
- **Course Management**: Complete course management system
- **Enrollment System**: Student-course enrollment tracking
- **File Upload**: Profile picture upload for students
- **Request Logging**: Custom middleware for request logging
- **Database**: SQLite with SQLAlchemy ORM

## Project Structure

```
student_management_system/
├── main.py              # FastAPI application with all routes
├── models.py            # SQLAlchemy models (User, Student, Course, Enrollment)
├── schemas.py           # Pydantic schemas for request/response validation
├── database.py          # Database configuration and connection
├── crud.py              # CRUD operations for all models
├── auth.py              # JWT authentication and password hashing
├── middleware.py        # Custom request logging middleware
├── uploads/             # Directory for uploaded profile pictures
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Installation

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**:
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Default Credentials

The system creates a default admin user on startup:
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

## API Endpoints

### Authentication
- `POST /login` - Login and get JWT token
- `POST /register` - Register new user (admin only)

### Students
- `POST /students/` - Create new student
- `GET /students/` - Get all students
- `GET /students/{id}` - Get student by ID
- `PUT /students/{id}` - Update student
- `DELETE /students/{id}` - Delete student (admin only)

### Courses
- `POST /courses/` - Create new course
- `GET /courses/` - Get all courses
- `GET /courses/{id}` - Get course by ID
- `PUT /courses/{id}` - Update course
- `DELETE /courses/{id}` - Delete course (admin only)

### Enrollments
- `POST /enroll/` - Enroll student in course
- `GET /enrollments/` - Get all enrollments
- `GET /students/{id}/enrollments` - Get student's enrollments
- `GET /courses/{id}/enrollments` - Get course enrollments

### File Upload
- `POST /upload/` - Upload student profile picture

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

## Usage Examples

### 1. Login
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

### 2. Create Student
```bash
curl -X POST "http://localhost:8000/students/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### 3. Create Course
```bash
curl -X POST "http://localhost:8000/courses/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Mathematics 101", "description": "Basic mathematics course"}'
```

### 4. Enroll Student
```bash
curl -X POST "http://localhost:8000/enroll/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"student_id": 1, "course_id": 1}'
```

### 5. Upload Profile Picture
```bash
curl -X POST "http://localhost:8000/upload/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "student_id=1" \
  -F "file=@profile.jpg"
```

## Database Models

### User
- `id`: Primary key
- `username`: Unique username
- `hashed_password`: Bcrypt hashed password
- `role`: "admin" or "teacher"
- `created_at`: Timestamp

### Student
- `id`: Primary key
- `name`: Student name
- `email`: Unique email address
- `profile_pic`: Path to uploaded profile picture
- `created_at`: Timestamp

### Course
- `id`: Primary key
- `title`: Course title
- `description`: Course description
- `created_at`: Timestamp

### Enrollment
- `id`: Primary key
- `student_id`: Foreign key to Student
- `course_id`: Foreign key to Course
- `enrolled_at`: Timestamp

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Role-based Access**: Admin and teacher roles with different permissions
- **File Validation**: Secure file upload with type validation

## Development

The application includes:
- **Request Logging**: All requests are logged with timing information
- **Error Handling**: Comprehensive error responses
- **Data Validation**: Pydantic models for request/response validation
- **Database Relationships**: Proper foreign key relationships
- **File Management**: Secure file upload and storage

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Dependencies

All required dependencies are listed in `requirements.txt`:
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation and serialization
- **python-jose**: JWT token handling
- **passlib**: Password hashing
- **python-multipart**: File upload support
- **email-validator**: Email validation