'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { LoginSchema, type LoginInput } from '../login.dto';
import { useLogin } from '../_hooks/hook.client';
import { EyeClosed, EyeIcon } from 'lucide-react';
import { useState } from 'react';

function safeNext(value: string | null): string {
  if (value?.startsWith('/') && !value.startsWith('//')) {
    return value;
  }
  return '/admin';
}

export function LoginSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(data: LoginInput) {
    mutate(data, {
      onSuccess: () => {
        toast.add({
          title: 'Logged in',
          description: 'Welcome back.',
          type: 'success',
        });
        router.replace(safeNext(searchParams.get('next')));
      },
      onError: (error) => {
        const msg = isAxiosError<{ message?: string | string[] }>(error)
          ? [error.response?.data?.message].flat().filter(Boolean).join(', ') || error.message
          : error instanceof Error
            ? error.message
            : 'Unknown error';
        toast.add({
          title: 'Login failed',
          description: msg,
          type: 'error',
        });
      },
    });
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='container'>
        <Reveal className='mx-auto w-full max-w-md'>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Sign in to manage portfolio content.</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <CardContent className='space-y-5'>
                <div className='space-y-2'>
                  <label htmlFor='email' className='text-muted-foreground text-sm'>
                    Email
                  </label>
                  <Input
                    className='mt-2'
                    id='email'
                    type='email'
                    autoComplete='email'
                    placeholder='mikail.arianos@example.com'
                    aria-invalid={errors.email ? true : undefined}
                    disabled={isPending}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className='text-destructive text-sm'>{errors.email.message}</p>
                  )}
                </div>

                <div className='relative space-y-2'>
                  <label htmlFor='password' className='text-muted-foreground text-sm'>
                    Password
                  </label>
                  <Input
                    className='mt-2 pe-8'
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    placeholder={showPassword ? 'Password' : '••••••••'}
                    aria-invalid={errors.password ? true : undefined}
                    disabled={isPending}
                    {...register('password')}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute top-8.5 right-3 cursor-pointer'
                    type='button'
                  >
                    {showPassword ? <EyeClosed /> : <EyeIcon />}
                  </button>
                  {errors.password && (
                    <p className='text-destructive text-sm'>{errors.password.message}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className='mt-6'>
                <Button type='submit' className='w-full' disabled={isPending}>
                  {isPending && <Spinner />}
                  {isPending ? 'Signing in…' : 'Sign in'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
