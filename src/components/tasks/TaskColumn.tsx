import { Droppable } from 'react-beautiful-dnd';
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
}

export function TaskColumn({ id, title, tasks, onTaskClick, onAddTask }: TaskColumnProps) {
  return (
    <div className="flex h-full w-80 flex-col rounded-lg bg-gray-100 p-4">
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
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto ${
              snapshot.isDraggingOver ? 'bg-gray-200' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}