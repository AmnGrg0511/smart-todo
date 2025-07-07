'use client';

import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import { fetchTasks, createTask } from '../../lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PlusCircle,
  ListTodo,
  FileText,
  CalendarDays,
  Star,
  Tag,
  Sparkles,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  category_name: string;
  priority_score: number;
  deadline: string;
  status: 'pending' | 'in_progress' | 'done';
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks().then(setTasks).catch(console.error);
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTask = await createTask({
        title,
        description,
        category: null,
        priority_score: 50,
        deadline: new Date().toISOString(),
        status: 'pending',
      });
      setTasks([newTask, ...tasks]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-transparent text-gray-900 dark:text-gray-100">
      <Card className="mb-12 w-full max-w-3xl bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <CardHeader className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Quick Add Task</CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Add a new task to your list</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleCreateTask} className="space-y-6">
            <div>
              <Label htmlFor="Title" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Task Title</Label>
              <div className="relative">
                <ListTodo className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Finish project report"
                  required
                  className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="Description" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Description (Optional)</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <Textarea
                  id="Description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about the task..."
                  className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              <PlusCircle className="w-5 h-5 mr-2" /> Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="w-full max-w-3xl mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center">
            <ListTodo className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Your Tasks</h2>
        </div>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-xl">No tasks yet. Add one above to get started!</p>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={handleDeleteTask} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
