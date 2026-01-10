'use client';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Mail, User as UserIcon, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <AppLayout><div></div></AppLayout>; // AppLayout handles redirect
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <AppLayout>
      <PageHeader title="My Profile" />
      <div className="p-4 md:p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <UserIcon className="h-5 w-5" />
              <span className="text-foreground capitalize">{user.role}</span>
            </div>
             <div className="flex items-center gap-4 text-muted-foreground">
              <Shield className="h-5 w-5" />
              <span className="text-foreground">Verified User</span>
            </div>
            <Button onClick={logout} variant="outline" className="w-full mt-4">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
