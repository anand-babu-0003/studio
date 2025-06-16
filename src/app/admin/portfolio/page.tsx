
"use client";

import { useEffect, useState, useMemo } from 'react'; 
import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom';
import { useForm, type Path } from 'react-hook-form';
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

import { portfolioItems as initialPortfolioItemsData } from '@/lib/data';
import type { PortfolioItem } from '@/lib/types';
import {
  savePortfolioItemAction,
  deletePortfolioItemAction,
  type PortfolioFormState,
} from '@/actions/admin/portfolioActions';
import { portfolioItemAdminSchema, type PortfolioAdminFormData } from '@/lib/adminSchemas';

const initialFormState: PortfolioFormState = { message: '', status: 'idle', errors: {} };

const defaultFormValues: PortfolioAdminFormData = {
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
  readmeContent: '', // Added
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Project
        </>
      )}
    </Button>
  );
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioItem[]>(initialPortfolioItemsData);
  const [currentProject, setCurrentProject] = useState<PortfolioItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formActionState, formAction] = useActionState(savePortfolioItemAction, initialFormState);

  const form = useForm<PortfolioAdminFormData>({
    resolver: zodResolver(portfolioItemAdminSchema),
    defaultValues: defaultFormValues,
  });
  
  const formCardKey = useMemo(() => {
    if (!showForm) return 'hidden-form';
    if (currentProject) return `edit-${currentProject.id}-${new Date().getTime()}`;
    return `add-new-project-form-${new Date().getTime()}`;
  }, [showForm, currentProject]);
  

  useEffect(() => {
    console.log("AdminPortfolioPage: formActionState changed:", formActionState);
    if (formActionState.status === 'success' && formActionState.project) {
      const savedProject = formActionState.project;
      console.log("AdminPortfolioPage: Success, savedProject:", savedProject);
      toast({ title: "Success!", description: formActionState.message });

      setProjects(prevProjects => {
        console.log("AdminPortfolioPage: setProjects - prevProjects:", prevProjects);
        const existingIndex = prevProjects.findIndex(p => p.id === savedProject.id);
        let newProjectsArray;
        if (existingIndex > -1) {
          const updatedProjects = [...prevProjects];
          updatedProjects[existingIndex] = savedProject;
          newProjectsArray = updatedProjects;
          console.log("AdminPortfolioPage: setProjects - updating existing project, newProjectsArray:", newProjectsArray);
        } else {
          newProjectsArray = [...prevProjects, savedProject];
          console.log("AdminPortfolioPage: setProjects - adding new project, newProjectsArray:", newProjectsArray);
        }
        return newProjectsArray;
      });
      
      setShowForm(false);
      setCurrentProject(null);
      form.reset(defaultFormValues); 
      console.log("AdminPortfolioPage: Form reset to defaultFormValues after successful save.");

    } else if (formActionState.status === 'error') {
      console.error("AdminPortfolioPage: Error from server action (raw object):", formActionState);
      console.error("AdminPortfolioPage: Error from server action (JSON.stringify):", JSON.stringify(formActionState));
      
      const errorMessage = typeof formActionState.message === 'string' && formActionState.message.trim() !== ''
        ? formActionState.message
        : "An unspecified error occurred. Please check server logs for more details.";

      toast({ title: "Error Saving", description: errorMessage, variant: "destructive" });
      
      if (formActionState.errors) {
        Object.entries(formActionState.errors).forEach(([key, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            form.setError(key as Path<PortfolioAdminFormData>, { 
              type: 'server', 
              message: fieldErrorMessages.join(', ') 
            });
          }
        });
      }
    }
  }, [formActionState, toast, form]);

  const handleAddNew = () => {
    setCurrentProject(null);
    form.reset(defaultFormValues);
    setShowForm(true);
    console.log("AdminPortfolioPage: handleAddNew - form reset, showForm true");
  };

  const handleEdit = (project: PortfolioItem) => {
    setCurrentProject(project);
    form.reset({ 
      ...project,
      image1: project.images[0] || '',
      image2: project.images[1] || '',
      tagsString: project.tags.join(', '),
      readmeContent: project.readmeContent || '', // Added
    });
    setShowForm(true);
    console.log("AdminPortfolioPage: handleEdit - editing project:", project);
  };

  const handleDelete = async (projectId: string) => {
    console.log("AdminPortfolioPage: handleDelete - projectId:", projectId);
    const result = await deletePortfolioItemAction(projectId);
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      setProjects(prevProjects => {
        const updated = prevProjects.filter(p => p.id !== projectId);
        console.log("AdminPortfolioPage: handleDelete - projects updated:", updated);
        return updated;
      });
    } else {
      toast({ title: "Error Deleting", description: result.message, variant: "destructive" });
      console.error("AdminPortfolioPage: handleDelete - error:", result.message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentProject(null);
    form.reset(defaultFormValues);
    console.log("AdminPortfolioPage: handleCancelForm - form reset, showForm false");
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

      {showForm && (
        <Card key={formCardKey}> 
          <CardHeader>
            <CardTitle>{currentProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
            <CardDescription>Fill in the details for your portfolio project.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form action={formAction}>
              {currentProject?.id && <input type="hidden" {...form.register('id')} value={currentProject.id} />}
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
                <FormField control={form.control} name="readmeContent" render={({ field }) => (
                  <FormItem>
                    <FormLabel>README Content (Markdown)</FormLabel>
                    <FormControl><Textarea {...field} rows={15} placeholder="Paste your project's README.md content here..." /></FormControl>
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
      )}
      {!showForm && (
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

    
