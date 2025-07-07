import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Star, CalendarDays, Trash2, Edit, Clock, Hourglass, CheckCircle } from 'lucide-react';
import { deleteTask } from '../../lib/api';

interface Task {
  id: string;
  title: string;
  description: string;
  category_name: string;
  priority_score: number;
  deadline: string;
  status: 'pending' | 'in_progress' | 'done';
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const router = useRouter();

  const getPriorityVariant = (score: number) => {
    if (score >= 80) return 'destructive';
    if (score >= 60) return 'default'; // Consider a warning or specific color
    if (score >= 40) return 'secondary'; // Consider an info color
    return 'outline'; // Default or low priority
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'done': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="mr-1 h-3 w-3" />;
      case 'in_progress': return <Hourglass className="mr-1 h-3 w-3" />;
      case 'done': return <CheckCircle className="mr-1 h-3 w-3" />;
      default: return null;
    }
  };

  const handleEdit = () => {
    router.push(`/task-editor?id=${task.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <Card className="w-full border border-neutral-200 dark:border-neutral-700 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <CardTitle className="text-2xl font-semibold">{task.title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge className={`flex items-center ${getStatusClasses(task.status)}`}>
            {getStatusIcon(task.status)}
            {task.status.replace(/_/g, ' ').toUpperCase()}
          </Badge>
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="text-sm mb-3">
          {task.description || 'No description provided.'}
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 text-sm">
          {task.category_name && (
            <Badge variant="outline" className="flex items-center"><Tag className="mr-1 h-3 w-3" />{task.category_name}</Badge>
          )}
          <Badge variant={getPriorityVariant(task.priority_score)} className="flex items-center">
            <Star className="mr-1 h-3 w-3" /> Priority: {task.priority_score}
          </Badge>
          {task.deadline && (
            <Badge variant="outline" className="flex items-center">
              <CalendarDays className="mr-1 h-3 w-3" /> Due: {new Date(task.deadline).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
