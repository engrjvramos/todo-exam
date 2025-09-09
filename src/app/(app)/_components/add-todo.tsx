'use client';

import { useTodosContext } from '@/components/todo-context-provider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { todoSchema, TTodoSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AddTodo() {
  const { handleAddTodo } = useTodosContext();
  const [, startTransition] = useTransition();

  const form = useForm<TTodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todo: '',
    },
  });

  async function onSubmit(values: TTodoSchema) {
    if (!values.todo) return;
    const prevValue = values.todo;
    form.reset();

    startTransition(async () => {
      try {
        await handleAddTodo({
          ...values,
          isComplete: false,
        });
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to add todo');
        form.setValue('todo', prevValue);
      }
    });
  }
  return (
    <div
      className="mb-4 flex w-full items-center rounded-full border text-sm"
      style={{
        height: '145px',
        width: '100%',
      }}
    >
      <div
        className="bg-custom-300 flex aspect-square items-center justify-center rounded-l-full border-r border-gray-300 text-gray-300"
        style={{
          height: '145px',
          width: '145px',
          padding: '16px',
          backgroundColor: '#B6A08B',
          borderRadius: '9999px 0 0 9999px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3em"
          height="3em"
          fill="none"
          viewBox="0 0 65 61"
        >
          <path
            stroke="#D2C9CA"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M46.633 2.167H18.3A16.667 16.667 0 0 0 1.633 18.833v23.334A16.666 16.666 0 0 0 18.3 58.833h28.333A16.668 16.668 0 0 0 63.3 42.167V18.833A16.666 16.666 0 0 0 46.633 2.167Z"
          />
          <path
            stroke="#D2C9CA"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M2.467 47.167 11.633 36.5a7.333 7.333 0 0 1 9.234-.9 7.333 7.333 0 0 0 9.233-.9l7.767-7.767a13.334 13.334 0 0 1 17.2-1.433l8.3 6.433M19.133 24.4a5.533 5.533 0 1 0 0-11.067 5.533 5.533 0 0 0 0 11.067Z"
          />
        </svg>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative flex h-full w-full flex-1 items-center"
          style={{
            paddingInline: '40px',
            backgroundColor: 'white',
            height: '145px',
            width: '100%',
            borderRadius: '0 9999px 9999px 0',
          }}
        >
          <div
            className=""
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#0A1F56',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              color: 'white',
              position: 'absolute',
              right: '-15px',
            }}
          >
            <PlusIcon className="absolute top-1/2 size-5 -translate-y-1/2" />
          </div>

          <FormField
            control={form.control}
            name="todo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Add a task..."
                    className="flex h-10 border-none"
                    style={{
                      width: '100%',
                      minWidth: '100%',
                      border: 'none',
                      boxShadow: 'none',
                      borderBottom: '2px solid #D2C9CA',
                      borderRadius: '0',
                    }}
                    maxLength={250}
                    autoFocus
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
