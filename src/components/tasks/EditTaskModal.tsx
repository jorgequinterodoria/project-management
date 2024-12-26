import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated: (updatedTask: Task) => void;
}

export function EditTaskModal({
  isOpen,
  onClose,
  task,
  onTaskUpdated,
}: EditTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    setIsLoading(true);
    try {
      let reference_image_url = task.reference_image_url;

      // Upload image if there's a new one
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `task-images/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('task-assets')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Guardar la ruta completa relativa al bucket
        reference_image_url = fileName;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: formData.get('title') as string,
          context: formData.get('context') as string,
          completion_notes: formData.get('notes') as string,
          reference_image_url: reference_image_url || undefined,
        })
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Task updated successfully!');
      onTaskUpdated(data);
      onClose();
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          required
          defaultValue={task?.title || ''}
          placeholder="Enter task title"
        />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="context"
            required
            defaultValue={task?.context}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={4}
            placeholder="Describe the task"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Completion Notes
          </label>
          <textarea
            name="notes"
            defaultValue={task?.completion_notes || ''}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            placeholder="Add completion notes"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Reference Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {(imagePreview || task?.reference_image_url) && (
            <div className="mt-2">
              <img
                src={imagePreview || task?.reference_image_url}
                alt="Preview"
                className="rounded-md max-h-48 object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
} 