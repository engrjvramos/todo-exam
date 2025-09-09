import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import TodoForm from './_components/todo-form';

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Welcome to the Todo App</h1>
        <p className="mt-2 text-gray-600">Please login to manage your tasks.</p>
      </div>
    );
  }

  return (
    <>
      <TodoForm />
    </>
  );
}
