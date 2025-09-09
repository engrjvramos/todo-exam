'use client';

import { useId, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { registerFormSchema } from '@/lib/schema';
import { signUpUser } from '@/server/auth-actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, InfoIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { CloseToast } from './ui/sonner';

export default function SignUpForm() {
  const id = useId();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGooglePending, startGoogleTransition] = useTransition();

  const [isVisible, setIsVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: keyof typeof isVisible) => {
    setIsVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      setIsLoading(true);
      const response = await signUpUser(
        values.email,
        values.password,
        values.name,
      );
      if (response.success) {
        toast.success('Registration Successful!', {
          description: response.message,
          action: CloseToast,
        });
        form.reset();
        router.refresh();
      } else {
        toast.error('Failed to register', {
          description: response.message,
          action: CloseToast,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        fetchOptions: {
          onError: () => {
            toast.error('Oops! Something went wrong.');
          },
        },
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Sign Up</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Sign Up</DialogTitle>
            <DialogDescription className="sm:text-center">
              We just need a few details to get you started.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="h-11"
                      maxLength={100}
                      autoFocus
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="h-11"
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible.password ? 'text' : 'password'}
                        placeholder="Password"
                        className="h-11 pe-12"
                        maxLength={64}
                        {...field}
                        aria-invalid={!!form.formState.errors.password}
                      />
                      <Button
                        variant={'ghost'}
                        type="button"
                        className="text-muted-foreground hover:text-muted-foreground absolute top-1/2 right-2 size-8 -translate-y-1/2"
                        onClick={() => toggleVisibility('password')}
                        aria-label={
                          isVisible.password ? 'Hide password' : 'Show password'
                        }
                        aria-pressed={isVisible.password}
                        aria-controls="password"
                      >
                        {isVisible.password ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="flex items-center gap-2">
                    <InfoIcon className="size-4" />
                    At least 8 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible.confirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        className="h-11 pe-12"
                        maxLength={64}
                        {...field}
                        aria-invalid={!!form.formState.errors.password}
                      />
                      <Button
                        variant={'ghost'}
                        type="button"
                        className="text-muted-foreground hover:text-muted-foreground absolute top-1/2 right-2 size-8 -translate-y-1/2"
                        onClick={() => toggleVisibility('confirmPassword')}
                        aria-label={
                          isVisible.confirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                        aria-pressed={isVisible.confirmPassword}
                        aria-controls="password"
                      >
                        {isVisible.confirmPassword ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-11 w-full text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </Form>

        <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <Button
          className="h-11 w-full"
          variant={'outline'}
          disabled={isGooglePending}
          onClick={handleGoogleLogin}
        >
          {isGooglePending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>Sign in with Google</>
          )}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          By signing up you agree to our{' '}
          <a className="underline hover:no-underline" href="#">
            Terms
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
