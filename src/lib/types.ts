import { Todo } from '@/generated/prisma';
import { getTodoList } from '@/server/actions';

export type ApiResponse = {
  success: boolean;
  message: string;
};

export type TodoEssentials = Omit<
  Todo,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>;

export type TUserTodoList = Awaited<ReturnType<typeof getTodoList>>[0];
