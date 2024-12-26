import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';
import { Database } from '../../types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
  onDrop: (taskId: string, status: Task['status']) => void;
}

export function TaskColumn({ id, title, tasks, onTaskClick, onAddTask, onDrop }: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string, status: string }) => {
      if (item.status !== id) {
        onDrop(item.id, id as Task['status']);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }), [id, onDrop]);

  return (
    <div 
      ref={drop}
      className="flex h-full w-80 flex-col rounded-lg bg-gray-100 p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddTask}
          className="h-7 px-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div
        className={`flex-1 overflow-y-auto ${
          isOver ? 'bg-gray-200 ring-2 ring-blue-500 ring-inset' : ''
        }`}
      >
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}