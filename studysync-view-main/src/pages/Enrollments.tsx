import { useEffect, useState } from 'react';
import { Plus, Search, Trash2, UserCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { enrollmentsService, Enrollment } from '@/services/enrollments';
import { studentsService, Student } from '@/services/students';
import { coursesService, Course } from '@/services/courses';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ student_id: '', course_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        enrollmentsService.getAll(),
        studentsService.getAll(),
        coursesService.getAll(),
      ]);
      setEnrollments(enrollmentsData);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await enrollmentsService.create({
        student_id: parseInt(formData.student_id),
        course_id: parseInt(formData.course_id),
      });
      
      // Add student and course details to the enrollment
      const student = students.find(s => s.id === parseInt(formData.student_id));
      const course = courses.find(c => c.id === parseInt(formData.course_id));
      const enrichedEnrollment = { ...created, student, course };
      
      setEnrollments([...enrollments, enrichedEnrollment]);
      toast({
        title: 'Success',
        description: 'Student enrolled successfully',
      });
      
      setIsDialogOpen(false);
      setFormData({ student_id: '', course_id: '' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to enroll student',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await enrollmentsService.delete(id);
      setEnrollments(enrollments.filter(e => e.id !== id));
      toast({
        title: 'Success',
        description: 'Enrollment removed successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove enrollment',
      });
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enrollments</h1>
          <p className="text-muted-foreground">Manage student course enrollments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-primary hover:bg-primary-dark text-primary-foreground"
              onClick={() => setFormData({ student_id: '', course_id: '' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Enroll Student
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-surface border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Enroll Student in Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Select Student</Label>
                <Select value={formData.student_id} onValueChange={(value) => setFormData({ ...formData, student_id: value })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id!.toString()}>
                        {student.name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Select Course</Label>
                <Select value={formData.course_id} onValueChange={(value) => setFormData({ ...formData, course_id: value })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id!.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-primary hover:bg-primary-dark text-primary-foreground"
                  disabled={!formData.student_id || !formData.course_id}
                >
                  Enroll
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-surface border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enrollments
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Students
            </CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Set(enrollments.map(e => e.student_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique students</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Courses
            </CardTitle>
            <UserCheck className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Set(enrollments.map(e => e.course_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Courses with students</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface border-border shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Enrollment List</CardTitle>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search enrollments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Student</TableHead>
                <TableHead className="text-muted-foreground">Course</TableHead>
                <TableHead className="text-muted-foreground">Enrollment Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-48 bg-muted animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-8 w-20 bg-muted animate-pulse rounded"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredEnrollments.length === 0 ? (
                <TableRow className="border-border">
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No enrollments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id} className="border-border hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-sm">
                          {enrollment.student?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{enrollment.student?.name}</p>
                          <p className="text-sm text-muted-foreground">{enrollment.student?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {enrollment.course?.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(enrollment.enrollment_date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-surface border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-foreground">Remove Enrollment?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              This will remove {enrollment.student?.name} from the course 
                              "{enrollment.course?.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(enrollment.id!)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}