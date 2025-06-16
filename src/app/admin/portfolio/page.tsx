
"use client";

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Edit3, Trash2, Save, Loader2, XCircle } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


import { portfolioItems as initialPortfolioItems } from '@/lib/data';
import type { PortfolioItem } from '@/lib/types';
import {
  savePortfolioItemAction,
  deletePortfolioItemAction,
  type PortfolioAdminFormData,
  type PortfolioFormState,
  portfolioItemAdminSchema
} from '@/actions/admin/portfolioActions';

const initialFormState: PortfolioFormState = { message: '', status: 'idle', errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {pending ? 'Saving...' : 'Save Project'}
    </Button>
  );
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioItem[]>(initialPortfolioItems);
  const [currentProject, setCurrentProject] = useState<PortfolioItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formActionState, formAction] = useFormState(savePortfolioItemAction, initialFormState);

  const form = useForm<PortfolioAdminFormData>({
    resolver: zodResolver(portfolioItemAdminSchema),
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      image1: '',
      image2: '',
      tagsString: '',
      liveUrl: '',
      repoUrl: '',
      slug: '',
      dataAiHint: '',
    },
  });

  useEffect(() => {
    if (formActionState.status === 'success' && formActionState.project) {
      const savedProject = formActionState.project;
      toast({ title: "Success!", description: formActionState.message });
      setProjects(prevProjects => {
        const existingIndex = prevProjects.findIndex(p => p.id === savedProject.id);
        if (existingIndex > -1) {
          const updatedProjects = [...prevProjects];
          updatedProjects[existingIndex] = savedProject;
          return updatedProjects;
        }
        return [...prevProjects, savedProject];
      });
      setShowForm(false);
      setCurrentProject(null);
      form.reset(); 
    } else if (formActionState.status === 'error') {
      toast({ title: "Error Saving", description: formActionState.message, variant: "destructive" });
      if (formActionState.errors) {
        Object.entries(formActionState.errors).forEach(([key, value]) => {
          form.setError(key as keyof PortfolioAdminFormData, { type: 'server', message: value?.join(', ') });
        });
      }
    }
  }, [formActionState, toast, form]);

  const handleAddNew = () => {
    setCurrentProject(null);
    form.reset({ // Reset with empty strings or specific defaults for "add new"
      id: undefined, 
      title: '', description: '', longDescription: '',
      image1: '', image2: '', tagsString: '',
      liveUrl: '', repoUrl: '', slug: '', dataAiHint: ''
    });
    setShowForm(true);
  };

  const handleEdit = (project: PortfolioItem) => {
    setCurrentProject(project);
    form.reset({
      ...project,
      image1: project.images[0] || '',
      image2: project.images[1] || '',
      tagsString: project.tags.join(', '),
    });
    setShowForm(true);
  };

  const handleDelete = async (projectId: string) => {
    const result = await deletePortfolioItemAction(projectId);
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
    } else {
      toast({ title: "Error Deleting", description: result.message, variant: "destructive" });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentProject(null);
    form.reset(); 
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage Portfolio" subtitle="Add, edit, or delete your projects." className="py-0 md:py-0 pb-8 text-left" />
        {!showForm && (
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{currentProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
            <CardDescription>Fill in the details for your portfolio project.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form action={formAction}>
              {currentProject && <input type="hidden" {...form.register('id')} value={currentProject.id} />}
              <CardContent className="space-y-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (e.g., my-awesome-project)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description (for cards)</FormLabel>
                    <FormControl><Textarea {...field} rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="longDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description (for detail page)</FormLabel>
                    <FormControl><Textarea {...field} rows={6} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="image1" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL 1</FormLabel>
                    <FormControl><Input {...field} placeholder="https://placehold.co/600x400.png" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="image2" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL 2 (Optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="https://placehold.co/600x400.png" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="tagsString" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated, e.g., React, Next.js, TypeScript)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="liveUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Demo URL (Optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="https://example.com/live-demo" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="repoUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Repository URL (Optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="https://github.com/user/project" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image AI Hint (Optional, e.g., "website design")</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancelForm}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <SubmitButton />
              </CardFooter>
            </form>
          </Form>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.length === 0 && <p className="text-muted-foreground">No projects yet. Click "Add New Project" to start.</p>}
          {projects.map(project => (
            <Card key={project.id} className="flex items-center justify-between p-4">
              <span className="font-medium">{project.title}</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  <Edit3 className="mr-1 h-4 w-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project "{project.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(project.id)}>
                        Yes, delete project
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
