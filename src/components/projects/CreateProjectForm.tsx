import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function CreateProjectForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          user_id: user.id,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Project created successfully!');
      navigate(`/project/${data.id}`);
    } catch (error) {
      toast.error('Failed to create project');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Project Name"
        name="name"
        required
        placeholder="Enter project name"
        autoFocus
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          required
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={4}
          placeholder="Describe your project"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Create Project
        </Button>
      </div>
    </form>
  );
}