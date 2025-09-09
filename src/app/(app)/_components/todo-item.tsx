import { Checkbox } from '@/components/ui/checkbox';
import { TUserTodoList } from '@/lib/types';
import { Trash2Icon } from 'lucide-react';
import EditTodo from './edit-todo';

type Props = {
  data: TUserTodoList;
  handleDelete: (id: TUserTodoList['id']) => Promise<void>;
  handleToggleComplete: (
    id: string,
    todo: TUserTodoList,
    field: 'isComplete',
  ) => Promise<void>;
};
export default function TodoItem({
  data,
  handleDelete,
  handleToggleComplete,
}: Props) {
  const { isComplete, todo, id } = data;

  return (
    <li
      className="relative mb-4 flex w-full items-center rounded-full border text-sm"
      style={{
        height: '145px',
      }}
    >
      <Checkbox
        className="checked:bg-custom-700 size-5 rounded-full checked:border-white"
        checked={isComplete}
        onCheckedChange={() => handleToggleComplete(id, data, 'isComplete')}
        style={{
          width: '40px',
          height: '40px',
          position: 'absolute',
          left: '-15px',
          backgroundColor: isComplete ? '#0a1f56' : '#D2C9CA',
          border: isComplete ? '4px solid white' : '4px solid #B6A08B',
        }}
      />
      <div
        className="bg-custom-300 flex aspect-square items-center justify-center border-r border-gray-300 text-gray-300"
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
      <div
        className="flex h-full w-full items-center justify-between"
        style={{
          paddingInline: '40px',
          backgroundColor: isComplete ? '#D4D8E5' : '#D2C9CA',
          height: '145px',
          borderRadius: '0 9999px 9999px 0',
        }}
      >
        <span className={isComplete ? 'text-gray-500 line-through' : ''}>
          {todo}
        </span>
        <div className="flex items-center gap-2">
          <EditTodo initialValues={data} />
          <button
            content="rounded-full"
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
            className=""
            onClick={() => handleDelete(id)}
          >
            <Trash2Icon className="size-5" />
          </button>
        </div>
      </div>
    </li>
  );
}
