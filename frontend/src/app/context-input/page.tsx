'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  MessageSquare,
  Mail,
  FileText,
  Clock,
  Send,
  Sparkles,
  Database,
  CalendarDays
} from 'lucide-react';
import { submitContext, fetchContextEntries } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContextEntry {
  id: string;
  content: string;
  source_type: 'whatsapp' | 'email' | 'note';
  timestamp: string;
  processed_insights: any;
}

export default function ModernContextInputPage() {
  const [content, setContent] = useState('');
  const [sourceType, setSourceType] = useState('note');
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));
  const [contextEntries, setContextEntries] = useState<ContextEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadContextEntries = async () => {
      try {
        const entries = await fetchContextEntries();
        const sortedEntries = entries.sort((a: ContextEntry, b: ContextEntry) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setContextEntries(sortedEntries);
      } catch (error) {
        console.error('Error fetching context entries:', error);
      }
    };
    loadContextEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newEntry = await submitContext({
        content,
        source_type: sourceType,
        timestamp,
      });

      setContextEntries([newEntry, ...contextEntries]);
      setContent('');
      setTimestamp(new Date().toISOString().slice(0, 16));
    } catch (error) {
      console.error('Error submitting context:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getSourceColor = (sourceType: string) => {
    switch (sourceType) {
      case 'whatsapp': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'email': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'note': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-transparent text-gray-900 dark:text-gray-100">
      {/* Submit Form */}
      <Card className="mb-12 w-full max-w-3xl bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <CardHeader className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Add New Context</CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Submit messages, emails, or notes to build your context history</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="Description" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">Content</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <Textarea
                  id="Description"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add more details about the task..."
                  className="pl-10 w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sourceType" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">
                  Source Type
                </Label>
                <Select onValueChange={setSourceType} value={sourceType}>
                  <SelectTrigger className="w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Note
                      </div>
                    </SelectItem>
                    <SelectItem value="whatsapp">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timestamp" className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2 block">
                  Timestamp
                </Label>
                <Input
                  id="timestamp"
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
            </div>
            <Button
              type='submit'
              disabled={isSubmitting || !content.trim()}
              className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Context
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Context History */}
      <section className="w-full max-w-3xl mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Context History
          </h2>
        </div>

        {contextEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              No context entries yet. Submit one above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contextEntries.map((entry) => (
              <Card key={entry.id} className="rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed mb-3">
                      {entry.content}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(entry.source_type)}`}>
                        {getSourceIcon(entry.source_type)}
                        <span className="capitalize">{entry.source_type}</span>
                      </div>

                      <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                        <CalendarDays className="w-3 h-3" />
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}