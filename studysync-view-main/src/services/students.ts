import api from './api';

export interface Student {
  id?: number;
  name: string;
  email: string;
  profile_picture?: string;
}

export const studentsService = {
  async getAll(): Promise<Student[]> {
    const response = await api.get('/students');
    return response.data;
  },

  async getById(id: number): Promise<Student> {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const response = await api.post('/students', student);
    return response.data;
  },

  async update(id: number, student: Partial<Student>): Promise<Student> {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/students/${id}`);
  },

  async uploadProfilePicture(studentId: number, file: File): Promise<{ filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/students/${studentId}/upload-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};