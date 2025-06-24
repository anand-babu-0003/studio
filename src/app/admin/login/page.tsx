
"use client";

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, LogIn, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { loginAction, type LoginFormState } from '@/actions/admin/authActions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
     <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing In...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" /> Sign In
        </>
      )}
    </Button>
  );
}

const initialState: LoginFormState = { message: '', status: 'idle' };

export default function AdminLoginPage() {
  const router = useRouter();
  const [formState, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (formState.status === 'success') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdminLoggedIn', 'true');
      }
      router.replace('/admin/dashboard');
    }
  }, [formState, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary p-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Admin Panel</CardTitle>
          <CardDescription>Please log in to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300">
            <AlertCircle className="h-4 w-4 !text-yellow-500" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              This is a basic auth system for a single-user panel. For multi-user or high-security needs, a dedicated provider like Firebase Auth is recommended.
            </AlertDescription>
          </Alert>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            {formState.status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{formState.message}</AlertDescription>
              </Alert>
            )}
            <SubmitButton />
          </form>
        </CardContent>
         <CardFooter className="flex flex-col items-center text-center text-xs text-muted-foreground pt-6 gap-4">
           <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> View Live Site
              </Link>
            </Button>
          <p className="w-full">
            Login credentials should be set as environment variables on the server.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
