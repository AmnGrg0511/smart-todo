'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTask, getAISuggestions, fetchCategories, updateTask, fetchTasks, createCategory, updateCategory, deleteCategory } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ListTodo, FileText, Tag, Star, CalendarDays, CheckCircle, Sparkles, Save, PlusCircle, Edit, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  category_name: string;
  priority_score: number;
  deadline: string;
  status: 'pending' | 'in_progress' | 'done';
}

interface Category {
  id: string;
  name: string;
}

export default function TaskEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priorityScore, setPriorityScore] = useState(50);
  const [deadline, setDeadline] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000); // convert to local
    return localDate.toISOString().slice(0, 16);
  });
  const [status, setStatus] = useState('pending');
  const [categories, setCategories] = useState<Category[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const getCategoriesAndTask = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        if (taskId) {
          const tasksData = await await fetchTasks();
          const taskToEdit = tasksData.find((t: Task) => t.id === taskId);
          if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            const matchedCategory = categoriesData.find(cat => cat.name === taskToEdit.category_name);
            setCategory(matchedCategory ? matchedCategory.id : '');
            setPriorityScore(taskToEdit.priority_score);
            setDeadline(taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().slice(0, 16) : '');
            setStatus(taskToEdit.status);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getCategoriesAndTask();
  }, [taskId]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;

    try {
      const newCat = await createCategory({ name: newCategoryName });
      setCategories([...categories, newCat]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || editingCategory.name.trim() === '') return;

    try {
      const updatedCat = await updateCategory(editingCategory.id, { name: editingCategory.name });
      setCategories(categories.map(cat => cat.id === updatedCat.id ? updatedCat : cat));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    console.log("Attempting to delete category with ID:", id);
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData = {
        title,
        description,
        category: category || null,
        priority_score: priorityScore,
        deadline,
        status,
      };

      if (taskId) {
        await updateTask(taskId, taskData);
      } else {
        await createTask(taskData);
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleGetSuggestions = async () => {
    try {
      const suggestions = await getAISuggestions({
        task_details: { title, description, category },
        context_entries: [],
      });
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-transparent text-gray-900 dark:text-gray-100">
      <Card className="w-full max-w-3xl bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <CardHeader className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Create/Edit Task</CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Add a task with details and deadline</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Title</Label>
              <div className="relative">
                <ListTodo className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Finish project report"
                  required
                  className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Description</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <Textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about the task..."
                  className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Category</Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Select onValueChange={setCategory} value={category || ''}>
                    <SelectTrigger className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Manage Categories</DialogTitle>
                      <DialogDescription>
                        Add, edit, or delete your task categories.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <form onSubmit={(e) => { (editingCategory ? handleUpdateCategory : handleAddCategory)(e); e.stopPropagation(); }} className="flex space-x-2">
                        <Input
                          id="categoryNameInput"
                          value={editingCategory ? editingCategory.name : newCategoryName}
                          onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCategoryName(e.target.value)}
                          placeholder="New category name"
                          className="flex-1"
                        />
                        <Button type="submit" onClick={(e) => e.stopPropagation()}>
                          {editingCategory ? 'Update' : 'Add'}
                        </Button>
                        {editingCategory && (
                          <Button variant="secondary" onClick={() => setEditingCategory(null)}>
                            Cancel
                          </Button>
                        )}
                      </form>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <div key={cat.id} className="flex items-center justify-between">
                            <span>{cat.name}</span>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => setEditingCategory(cat)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div>
              <Label htmlFor="priorityScore" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Priority Score</Label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="priorityScore"
                  type="number"
                  value={priorityScore}
                  onChange={(e) => setPriorityScore(parseInt(e.target.value))}
                  className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="deadline" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Deadline</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Status</Label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Select onValueChange={setStatus} value={status}>
                  <SelectTrigger className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button type="submit" className="flex-1 rounded-lg py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                <Save className="w-5 h-5 mr-2" /> Save Task
              </Button>
              <Button variant="secondary" type="button" onClick={handleGetSuggestions} className="flex-1 rounded-lg py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                <Sparkles className="w-5 h-5 mr-2" /> Get AI Suggestions
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {
        aiSuggestions && (
          <Card className="mt-10 w-full max-w-3xl bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <CardHeader className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-base">
              <p><strong>Prioritization:</strong> <span className="font-semibold text-blue-600 dark:text-blue-400">{aiSuggestions.prioritization}</span></p>
              <p><strong>Deadline:</strong> <span className="font-semibold text-blue-600 dark:text-blue-400">{new Date(aiSuggestions.deadline_recommendation).toLocaleDateString()}</span></p>
              <p><strong>Enhanced Description:</strong> <span className="font-semibold text-blue-600 dark:text-blue-400">{aiSuggestions.enhanced_description}</span></p>
              <p><strong>Category Recommendations:</strong> <span className="font-semibold text-blue-600 dark:text-blue-400">{aiSuggestions.category_recommendations.join(', ')}</span></p>
            </CardContent>
          </Card>
        )
      }
    </main >
  );
}