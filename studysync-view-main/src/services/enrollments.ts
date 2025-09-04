import api from './api';
import { Student } from './students';
import { Course } from './courses';

export interface Enrollment {
  id?: number;
  student_id: number;
  course_id: number;
  student?: Student;
  course?: Course;
  enrollment_date?: string;
}

export interface EnrollmentRequest {
  student_id: number;
  course_id: number;
}

export const enrollmentsService = {
  async getAll(): Promise<Enrollment[]> {
    const response = await api.get('/enrollments');
    return response.data;
  },

  async create(enrollment: EnrollmentRequest): Promise<Enrollment> {
    const response = await api.post('/enroll', enrollment);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/enrollments/${id}`);
  },
};