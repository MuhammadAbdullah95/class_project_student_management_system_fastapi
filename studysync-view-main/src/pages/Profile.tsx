import { useState } from 'react';
import { User, Settings, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { authService } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'default';
      case 'teacher':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'teacher':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card className="bg-surface border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{user?.username}</h3>
                <Badge className={getRoleColor(user?.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-foreground font-mono text-sm">{user?.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <p className="text-foreground capitalize">{user?.role || 'User'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-foreground">{user?.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-surface border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div>
                  <p className="font-medium text-foreground">Account Status</p>
                  <p className="text-sm text-muted-foreground">Your account is active</p>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div>
                  <p className="font-medium text-foreground">Last Login</p>
                  <p className="text-sm text-muted-foreground">Just now</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div>
                  <p className="font-medium text-foreground">Session</p>
                  <p className="text-sm text-muted-foreground">You are currently signed in</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-surface border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Sign out of your account?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      You will be redirected to the login page and will need to sign in again 
                      to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="bg-surface border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-background border border-border">
              <h4 className="font-semibold text-foreground">Student Management System</h4>
              <p className="text-sm text-muted-foreground mt-1">Version 1.0.0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border border-border">
              <h4 className="font-semibold text-foreground">API Status</h4>
              <p className="text-sm text-success mt-1">Connected</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border border-border">
              <h4 className="font-semibold text-foreground">Server</h4>
              <p className="text-sm text-muted-foreground mt-1">localhost:8000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}