'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  role: z.enum(['citizen', 'official', 'contractor']),
});

export function AuthForm() {
  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', role: 'citizen' },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError(null);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const success = auth.login(values.email);
    if (success) {
      router.push('/');
    } else {
      setError('No user found with this email. Please check the email or sign up.');
    }
    setIsLoading(false);
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setError(null);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const success = auth.signup(values.name, values.email, values.role);
    if (success) {
      router.push('/');
    } else {
      setError('A user with this email already exists. Please sign in.');
    }
    setIsLoading(false);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email-signin">Email</Label>
            <Input id="email-signin" type="email" placeholder="citizen@smartpark.com" {...loginForm.register('email')} />
            {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name-signup">Full Name</Label>
            <Input id="name-signup" placeholder="Alex Doe" {...signupForm.register('name')} />
            {signupForm.formState.errors.name && <p className="text-sm text-destructive">{signupForm.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-signup">Email</Label>
            <Input id="email-signup" type="email" placeholder="alex.doe@example.com" {...signupForm.register('email')} />
            {signupForm.formState.errors.email && <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-3">
             <Label>I am a...</Label>
             <RadioGroup defaultValue="citizen" className="flex gap-4" onValueChange={(value) => signupForm.setValue('role', value as 'citizen' | 'official' | 'contractor')}>
                 <div><RadioGroupItem value="citizen" id="r1" /><Label htmlFor="r1" className="ml-2">Citizen</Label></div>
                 <div><RadioGroupItem value="official" id="r2" /><Label htmlFor="r2" className="ml-2">Official</Label></div>
                 <div><RadioGroupItem value="contractor" id="r3" /><Label htmlFor="r3" className="ml-2">Contractor</Label></div>
             </RadioGroup>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </TabsContent>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Tabs>
  );
}
