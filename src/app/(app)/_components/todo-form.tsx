'use client';

import { useTodosContext } from '@/components/todo-context-provider';
import { TUserTodoList } from '@/lib/types';
import { startTransition, useState } from 'react';
import { toast } from 'sonner';
import AddTodo from './add-todo';
import TodoItem from './todo-item';

export default function TodoForm() {
  const { todos, handleDeleteTodo, handleEditTodo } = useTodosContext();
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

  async function handleToggleField(
    id: string,
    todo: TUserTodoList,
    field: 'isComplete',
  ) {
    startTransition(async () => {
      try {
        const updatedValue = !todo[field];
        await handleEditTodo(id, { ...todo, [field]: updatedValue });

        if (field === 'isComplete') {
          toast.success(
            todo.isComplete ? 'Task marked uncompleted' : 'Task completed',
            {
              action: {
                label: 'Undo',

                onClick: () => {
                  startTransition(async () => {
                    await handleEditTodo(id, {
                      ...todo,
                      [field]: !updatedValue,
                    });
                    toast.dismiss();
                  });
                },
              },
              classNames: {
                actionButton: '!bg-transparent !text-blue-500',
              },
            },
          );
        }
      } catch (error) {
        const e = error as Error;

        toast.error(e.message || 'Failed to edit todo');
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
          <TodoItem
            key={todo.id}
            data={todo}
            handleDelete={handleDelete}
            handleToggleComplete={handleToggleField}
          />
        ))}
      </ul>
    </div>
  );
}
