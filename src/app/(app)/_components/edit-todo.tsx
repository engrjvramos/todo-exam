import { useTodosContext } from '@/components/todo-context-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { todoSchema, TTodoSchema } from '@/lib/schema';
import { TUserTodoList } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon } from 'lucide-react';
import { startTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function EditTodo({
  initialValues,
}: {
  initialValues: TUserTodoList;
}) {
  const { handleEditTodo } = useTodosContext();

  const form = useForm<TTodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todo: initialValues.todo,
      isComplete: initialValues.isComplete,
    },
  });

  async function onSubmit(values: TTodoSchema) {
    const prevValue = values;

    startTransition(async () => {
      try {
        await handleEditTodo(initialValues.id, {
          ...values,
          isComplete: initialValues.isComplete,
        });
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to add todo');
        form.setValue('todo', prevValue.todo);
      }
    });
  }

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);

  return (
    <Dialog>
      <DialogTrigger
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#9D8065',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '9999px',
          color: 'white',
        }}
      >
        <EditIcon className="size-5" />
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription className="">
            Edit your todo here.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="todo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Task</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your title..."
                        className="mb-4 h-11"
                        maxLength={100}
                        autoFocus
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full items-center justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant={'outline'} className="">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" className="">
                    Edit
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
