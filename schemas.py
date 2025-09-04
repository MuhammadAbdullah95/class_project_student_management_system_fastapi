"""
Pydantic schemas for request/response models.
Defines data validation and serialization for API endpoints.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Student schemas
class StudentBase(BaseModel):
    name: str
    email: EmailStr

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class Student(StudentBase):
    id: int
    profile_pic: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class StudentWithEnrollments(Student):
    enrollments: List["EnrollmentWithCourse"] = []

# Course schemas
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class Course(CourseBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class CourseWithEnrollments(Course):
    enrollments: List["EnrollmentWithStudent"] = []

# Enrollment schemas
class EnrollmentBase(BaseModel):
    student_id: int
    course_id: int

class EnrollmentCreate(EnrollmentBase):
    pass

class Enrollment(EnrollmentBase):
    id: int
    enrolled_at: datetime
    
    class Config:
        from_attributes = True

class EnrollmentWithStudent(Enrollment):
    student: Student

class EnrollmentWithCourse(Enrollment):
    course: Course

class EnrollmentDetail(Enrollment):
    student: Student
    course: Course

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# File upload schema
class FileUploadResponse(BaseModel):
    filename: str
    file_path: str
    message: str

# Update forward references
StudentWithEnrollments.model_rebuild()
CourseWithEnrollments.model_rebuild()
