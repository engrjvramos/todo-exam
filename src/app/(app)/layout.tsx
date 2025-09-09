import { TodosContextProvider } from '@/components/todo-context-provider';
import { getTodoList } from '@/server/actions';
import Header from './_components/header';

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const todos = await getTodoList();

  return (
    <TodosContextProvider data={todos}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        <Header />
        <main>
          <div className="flex-1 p-4">{children}</div>
        </main>
      </div>
    </TodosContextProvider>
  );
}
