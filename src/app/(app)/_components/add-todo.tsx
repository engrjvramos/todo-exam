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
    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="todo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <PlusIcon className="text-muted-foreground absolute top-1/2 right-3 size-5 -translate-y-1/2" />
                    <Input
                      placeholder="Add a task..."
                      className="h-10 pr-10"
                      maxLength={250}
                      autoFocus
                      {...field}
                    />
                  </div>
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
