'use client';

import { TodoEssentials, TUserTodoList } from '@/lib/types';
import { createTodo, deleteTodo, editTodo } from '@/server/actions';
import { Todo } from '@prisma/client';

import { createContext, useContext, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

type TTodosContext = {
  todos: TUserTodoList[];
  selectedTodoId: string | null;
  selectedTodo: TUserTodoList | undefined;
  todosCount: number;
  handleAddTodo: (newTodo: TodoEssentials) => Promise<void>;
  handleEditTodo: (
    todoId: TUserTodoList['id'],
    newTodoData: TodoEssentials,
  ) => Promise<void>;
  handleDeleteTodo: (id: TUserTodoList['id']) => Promise<void>;
};

const TodosContext = createContext<TTodosContext | null>(null);

type TodoProviderProps = {
  data: TUserTodoList[];
  children: React.ReactNode;
};

export function TodosContextProvider({ children, data }: TodoProviderProps) {
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case 'add':
          return [{ ...payload, id: Math.random().toString() }, ...state];
        case 'edit':
          return state.map((todo) =>
            todo.id === payload.id ? { ...todo, ...payload.newTodoData } : todo,
          );
        case 'delete':
          return state.filter((todo) => todo.id !== payload);

        case 'rollback':
          return payload;
        default:
          return state;
      }
    },
  );

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  const selectedTodo = optimisticTodos.find(
    (todo) => todo.id === selectedTodoId,
  );
  const todosCount = optimisticTodos.length;

  const handleAddTodo = async (newTodo: TodoEssentials) => {
    const prevTodos = optimisticTodos;

    setOptimisticTodos({ action: 'add', payload: newTodo });
    const response = await createTodo({ ...newTodo });

    if (!response.success) {
      toast.warning(response.message);
      setOptimisticTodos({ action: 'rollback', payload: prevTodos });
    }
  };

  const handleEditTodo = async (
    todoId: Todo['id'],
    newTodoData: TodoEssentials,
  ) => {
    const prevTodos = optimisticTodos;

    setOptimisticTodos({
      action: 'edit',
      payload: { id: todoId, newTodoData },
    });
    const response = await editTodo(todoId, newTodoData);

    if (!response.success) {
      toast.warning(response.message);
      setOptimisticTodos({ action: 'rollback', payload: prevTodos });
    }
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    const prevTodos = optimisticTodos;

    setOptimisticTodos({ action: 'delete', payload: todoId });
    const response = await deleteTodo(todoId);

    if (!response.success) {
      toast.warning(response.message);
      setOptimisticTodos({ action: 'rollback', payload: prevTodos });
    }
    setSelectedTodoId(null);
  };

  return (
    <TodosContext.Provider
      value={{
        todos: optimisticTodos,
        selectedTodoId,
        selectedTodo,
        todosCount,
        handleAddTodo,
        handleEditTodo,
        handleDeleteTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}

export function useTodosContext() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodosContext must be used within a TodosProvider');
  }
  return context;
}
