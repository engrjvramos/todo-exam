import LoginForm from '@/components/login-form';
import LogoutButton from '@/components/logout-button';
import SignUpForm from '@/components/signup-form';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex items-center justify-between gap-2 border-b p-4">
      <h1
        className="text-3xl font-bold"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        My Todos
      </h1>
      {session ? (
        <div>
          <span className="mr-2">Welcome, {session.user?.name}</span>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <LoginForm />
          <SignUpForm />
        </div>
      )}
    </div>
  );
}
