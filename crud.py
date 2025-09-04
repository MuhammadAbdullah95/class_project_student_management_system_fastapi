"""
CRUD operations for Student Management System.
Contains helper functions for database operations on all models.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
import models
import schemas
from auth import get_password_hash

# User CRUD operations
def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    """Create a new user with hashed password."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    """Get user by username."""
    return db.query(models.User).filter(models.User.username == username).first()

# Student CRUD operations
def create_student(db: Session, student: schemas.StudentCreate) -> models.Student:
    """Create a new student."""
    db_student = models.Student(
        name=student.name,
        email=student.email
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def get_students(db: Session, skip: int = 0, limit: int = 100) -> List[models.Student]:
    """Get all students with pagination."""
    return db.query(models.Student).offset(skip).limit(limit).all()

def get_student(db: Session, student_id: int) -> Optional[models.Student]:
    """Get student by ID."""
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_student_by_email(db: Session, email: str) -> Optional[models.Student]:
    """Get student by email."""
    return db.query(models.Student).filter(models.Student.email == email).first()

def update_student(db: Session, student_id: int, student_update: schemas.StudentUpdate) -> Optional[models.Student]:
    """Update student information."""
    db_student = get_student(db, student_id)
    if not db_student:
        return None
    
    update_data = student_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_student, field, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

def update_student_profile_pic(db: Session, student_id: int, profile_pic_path: str) -> Optional[models.Student]:
    """Update student profile picture path."""
    db_student = get_student(db, student_id)
    if not db_student:
        return None
    
    db_student.profile_pic = profile_pic_path
    db.commit()
    db.refresh(db_student)
    return db_student

def delete_student(db: Session, student_id: int) -> bool:
    """Delete student by ID."""
    db_student = get_student(db, student_id)
    if not db_student:
        return False
    
    # Delete related enrollments first
    db.query(models.Enrollment).filter(models.Enrollment.student_id == student_id).delete()
    
    db.delete(db_student)
    db.commit()
    return True

# Course CRUD operations
def create_course(db: Session, course: schemas.CourseCreate) -> models.Course:
    """Create a new course."""
    db_course = models.Course(
        title=course.title,
        description=course.description
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def get_courses(db: Session, skip: int = 0, limit: int = 100) -> List[models.Course]:
    """Get all courses with pagination."""
    return db.query(models.Course).offset(skip).limit(limit).all()

def get_course(db: Session, course_id: int) -> Optional[models.Course]:
    """Get course by ID."""
    return db.query(models.Course).filter(models.Course.id == course_id).first()

def update_course(db: Session, course_id: int, course_update: schemas.CourseUpdate) -> Optional[models.Course]:
    """Update course information."""
    db_course = get_course(db, course_id)
    if not db_course:
        return None
    
    update_data = course_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_course, field, value)
    
    db.commit()
    db.refresh(db_course)
    return db_course

def delete_course(db: Session, course_id: int) -> bool:
    """Delete course by ID."""
    db_course = get_course(db, course_id)
    if not db_course:
        return False
    
    # Delete related enrollments first
    db.query(models.Enrollment).filter(models.Enrollment.course_id == course_id).delete()
    
    db.delete(db_course)
    db.commit()
    return True

# Enrollment CRUD operations
def create_enrollment(db: Session, enrollment: schemas.EnrollmentCreate) -> Optional[models.Enrollment]:
    """Create a new enrollment."""
    # Check if student and course exist
    student = get_student(db, enrollment.student_id)
    course = get_course(db, enrollment.course_id)
    
    if not student or not course:
        return None
    
    # Check if enrollment already exists
    existing_enrollment = db.query(models.Enrollment).filter(
        and_(
            models.Enrollment.student_id == enrollment.student_id,
            models.Enrollment.course_id == enrollment.course_id
        )
    ).first()
    
    if existing_enrollment:
        return None  # Already enrolled
    
    db_enrollment = models.Enrollment(
        student_id=enrollment.student_id,
        course_id=enrollment.course_id
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

def get_enrollments(db: Session, skip: int = 0, limit: int = 100) -> List[models.Enrollment]:
    """Get all enrollments with student and course information."""
    return db.query(models.Enrollment).offset(skip).limit(limit).all()

def get_student_enrollments(db: Session, student_id: int) -> List[models.Enrollment]:
    """Get all enrollments for a specific student."""
    return db.query(models.Enrollment).filter(models.Enrollment.student_id == student_id).all()

def get_course_enrollments(db: Session, course_id: int) -> List[models.Enrollment]:
    """Get all enrollments for a specific course."""
    return db.query(models.Enrollment).filter(models.Enrollment.course_id == course_id).all()

def delete_enrollment(db: Session, student_id: int, course_id: int) -> bool:
    """Delete enrollment by student and course ID."""
    enrollment = db.query(models.Enrollment).filter(
        and_(
            models.Enrollment.student_id == student_id,
            models.Enrollment.course_id == course_id
        )
    ).first()
    
    if not enrollment:
        return False
    
    db.delete(enrollment)
    db.commit()
    return True
