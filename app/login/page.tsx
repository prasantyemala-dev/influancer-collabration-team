'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl text-[var(--color-primary)] font-bold">CollabMap</CardTitle>
          <p className="text-slate-500">Enter your email to sign in</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

             <Button variant="outline" type="button" className="w-full" disabled>
              Google (Coming Soon)
            </Button>

             <div className="text-center text-sm text-slate-500 mt-4">
              Don't have an account? <Link href="/signup" className="text-[var(--color-primary)] font-semibold">Sign up</Link>
            </div>

             <div className="mt-4 bg-slate-100 p-4 rounded text-xs text-slate-600">
              <p className="font-bold mb-1">Demo Accounts:</p>
              <ul className="list-disc list-inside">
                <li>amit@example.com</li>
                <li>sara@example.com</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
