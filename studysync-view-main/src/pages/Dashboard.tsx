import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { studentsService } from '@/services/students';
import { coursesService } from '@/services/courses';
import { enrollmentsService } from '@/services/enrollments';
import { authService } from '@/services/auth';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, courses, enrollments] = await Promise.all([
          studentsService.getAll(),
          coursesService.getAll(),
          enrollmentsService.getAll(),
        ]);

        setStats({
          totalStudents: students.length,
          totalCourses: courses.length,
          totalEnrollments: enrollments.length,
          activeEnrollments: enrollments.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Enrollments',
      value: stats.totalEnrollments,
      icon: UserCheck,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Active This Month',
      value: stats.activeEnrollments,
      icon: TrendingUp,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Here's an overview of your student management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <Card key={item.title} className="bg-surface border-border shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`h-10 w-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                ) : (
                  item.value
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {loading ? '' : 'Total registered'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-surface border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New student registered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Course enrollment completed</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New course added</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <button className="w-full text-left p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Add New Student</p>
                    <p className="text-sm text-muted-foreground">Register a new student</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-success/5 border border-success/20 hover:bg-success/10 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium text-foreground">Create Course</p>
                    <p className="text-sm text-muted-foreground">Add a new course</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-warning/5 border border-warning/20 hover:bg-warning/10 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-warning" />
                  <div>
                    <p className="font-medium text-foreground">Enroll Student</p>
                    <p className="text-sm text-muted-foreground">Enroll in a course</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}