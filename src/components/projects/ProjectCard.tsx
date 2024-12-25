import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '../ui/Card';
import { Database } from '../../types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const statusIcons = {
    active: Clock,
    completed: CheckCircle2,
    archived: Calendar,
  };

  const StatusIcon = statusIcons[project.status];

  return (
    <Link to={`/project/${project.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <Card.Content>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
          <div className="mt-4 text-xs text-gray-500">
            Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}