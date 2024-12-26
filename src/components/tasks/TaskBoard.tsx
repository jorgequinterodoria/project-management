import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-hot-toast';
import { TaskColumn } from './TaskColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import './TaskBoard.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskBoardProps {
  projectId: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function TaskBoard({ projectId, tasks, setTasks }: TaskBoardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns = {
    todo: tasks.filter(task => task.status === 'todo'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed'),
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino o el destino es el mismo que el origen, no hacer nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(t => t.id === draggableId);
    const [movedTask] = updatedTasks.splice(taskIndex, 1);
    
    // Actualizar el estado de la tarea
    const newStatus = destination.droppableId as Task['status'];
    movedTask.status = newStatus;

    // Insertar la tarea en la nueva posición
    updatedTasks.splice(
      destination.index + 
      (destination.droppableId === source.droppableId && destination.index > source.index ? 0 : 0), 
      0, 
      movedTask
    );

    // Actualizar el estado local inmediatamente
    setTasks(updatedTasks);

    try {
      // Actualizar en la base de datos
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          order: destination.index
        })
        .eq('id', draggableId);

      if (error) throw error;
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error:', error);
      // Revertir cambios si hay error
      setTasks(tasks);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleDrop = async (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(t => t.id === taskId);
    const task = updatedTasks[taskIndex];

    if (task.status === newStatus) return;

    task.status = newStatus;
    setTasks(updatedTasks);

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error:', error);
      setTasks(tasks); // revert on error
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        <TaskColumn
          id="todo"
          title="To Do"
          tasks={columns.todo}
          onAddTask={() => setIsCreateModalOpen(true)}
          onTaskClick={setSelectedTask}
          onDrop={handleDrop}
        />
        <TaskColumn
          id="in_progress"
          title="In Progress"
          tasks={columns.in_progress}
          onAddTask={() => setIsCreateModalOpen(true)}
          onTaskClick={setSelectedTask}
          onDrop={handleDrop}
        />
        <TaskColumn
          id="completed"
          title="Completed"
          tasks={columns.completed}
          onAddTask={() => setIsCreateModalOpen(true)}
          onTaskClick={setSelectedTask}
          onDrop={handleDrop}
        />
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        onTaskCreated={(newTask) => setTasks(prev => [...prev, newTask])}
      />

      <EditTaskModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdate}
      />
    </DndProvider>
  );
}