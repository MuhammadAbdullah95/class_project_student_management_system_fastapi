import api from './api';

export interface Course {
  id?: number;
  title: string;
  description: string;
}

export const coursesService = {
  async getAll(): Promise<Course[]> {
    const response = await api.get('/courses');
    return response.data;
  },

  async getById(id: number): Promise<Course> {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async create(course: Omit<Course, 'id'>): Promise<Course> {
    const response = await api.post('/courses', course);
    return response.data;
  },

  async update(id: number, course: Partial<Course>): Promise<Course> {
    const response = await api.put(`/courses/${id}`, course);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/courses/${id}`);
  },
};