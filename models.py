"""
SQLAlchemy models for Student Management System.
Defines User, Student, Course, and Enrollment tables.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    """
    User model for authentication.
    Supports admin and teacher roles.
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "admin" or "teacher"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Student(Base):
    """
    Student model with profile picture support.
    """
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    profile_pic = Column(String, nullable=True)  # File path to uploaded image
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to enrollments
    enrollments = relationship("Enrollment", back_populates="student")

class Course(Base):
    """
    Course model for managing academic courses.
    """
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to enrollments
    enrollments = relationship("Enrollment", back_populates="course")

class Enrollment(Base):
    """
    Enrollment model to link students and courses.
    Many-to-many relationship between students and courses.
    """
    __tablename__ = "enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
