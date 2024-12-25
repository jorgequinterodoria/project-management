import { Draggable } from 'react-beautiful-dnd';
import { Image as ImageIcon, MessageSquare, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '../ui/Card';
import { Database } from '../../types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 ${snapshot.isDragging ? 'opacity-50' : ''}`}
        >
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClick(task)}
          >
            <Card.Content>
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(task);
                  }}
                >
                  <Edit2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.context}</p>
              
              {task.reference_image_url && (
                <div className="mt-2">
                  <img 
                    src={task.reference_image_url} 
                    alt="Reference"
                    className="rounded-md w-full h-32 object-cover"
                  />
                </div>
              )}
              
              <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                {task.reference_image_url && (
                  <span className="flex items-center">
                    <ImageIcon className="mr-1 h-3 w-3" />
                    Reference
                  </span>
                )}
                {task.completion_notes && (
                  <span className="flex items-center">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    Notes
                  </span>
                )}
                <span>
                  Updated {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
                </span>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </Draggable>
  );
}