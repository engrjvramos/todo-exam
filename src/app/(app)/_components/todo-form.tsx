'use client';

import { useTodosContext } from '@/components/todo-context-provider';
import { startTransition, useState } from 'react';
import { toast } from 'sonner';
import AddTodo from './add-todo';
import TodoItem from './todo-item';

export default function TodoForm() {
  const { todos, handleDeleteTodo } = useTodosContext();
  const [isAddTodo, setIsAddTodo] = useState(false);

  async function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await handleDeleteTodo(id);
        toast.success('Task deleted');
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to delete todo');
      }
    });
  }

  if (todos.length === 0) {
    return (
      <div>
        {isAddTodo ? (
          <AddTodo />
        ) : (
          <div
            className="mb-4 inline-block w-full rounded-full border px-4 py-2 text-sm"
            style={{
              padding: '55px',
            }}
          >
            There are no tasks yet.{' '}
            <button
              className="text-custom-500 inline-flex cursor-pointer underline"
              onClick={() => setIsAddTodo(true)}
            >
              Edit
            </button>{' '}
            to start.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AddTodo />
      <ul
        className="flex flex-col"
        style={{
          marginTop: '40px',
        }}
      >
        {todos.map((todo) => (
          <TodoItem key={todo.id} data={todo} handleDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}
