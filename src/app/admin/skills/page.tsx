
"use client";

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Edit3, Trash2, Save, Loader2, XCircle } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { skills as initialSkillsData, skillCategories, availableIconNames, lucideIconsMap } from '@/lib/data';
import type { Skill } from '@/lib/types';
import { saveSkillAction, deleteSkillAction, type SkillFormState } from '@/actions/admin/skillsActions';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';

const initialFormState: SkillFormState = { message: '', status: 'idle', errors: {} };

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
          Save Skill
        </>
      )}
    </Button>
  );
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(initialSkillsData);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formActionState, formAction] = useFormState(saveSkillAction, initialFormState);

  const form = useForm<SkillAdminFormData>({
    resolver: zodResolver(skillAdminSchema),
    defaultValues: {
      name: '',
      category: skillCategories[0],
      proficiency: undefined,
      iconName: availableIconNames[0] || '',
    },
  });

  useEffect(() => {
    if (formActionState.status === 'success' && formActionState.skill) {
      const savedSkill = formActionState.skill;
      toast({ title: "Success!", description: formActionState.message });
      setSkills(prevSkills => {
        const existingIndex = prevSkills.findIndex(s => s.id === savedSkill.id);
        if (existingIndex > -1) {
          const updatedSkills = [...prevSkills];
          updatedSkills[existingIndex] = savedSkill;
          return updatedSkills;
        }
        return [...prevSkills, savedSkill];
      });
      setShowForm(false);
      setCurrentSkill(null);
      form.reset({ name: '', category: skillCategories[0], proficiency: undefined, iconName: availableIconNames[0] || '' });
    } else if (formActionState.status === 'error') {
      toast({ title: "Error Saving", description: formActionState.message, variant: "destructive" });
      if (formActionState.errors) {
        Object.entries(formActionState.errors).forEach(([key, value]) => {
          form.setError(key as keyof SkillAdminFormData, { type: 'server', message: value?.join(', ') });
        });
      }
    }
  }, [formActionState, toast, form]);

  const handleAddNew = () => {
    setCurrentSkill(null);
    form.reset({
      id: undefined,
      name: '',
      category: skillCategories[0],
      proficiency: undefined,
      iconName: availableIconNames[0] || '',
    });
    setShowForm(true);
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    form.reset({
      ...skill,
      proficiency: skill.proficiency ?? undefined, // Ensure undefined if null/missing for form
    });
    setShowForm(true);
  };

  const handleDelete = async (skillId: string) => {
    const result = await deleteSkillAction(skillId);
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      setSkills(prevSkills => prevSkills.filter(s => s.id !== skillId));
    } else {
      toast({ title: "Error Deleting", description: result.message, variant: "destructive" });
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentSkill(null);
    form.reset({ name: '', category: skillCategories[0], proficiency: undefined, iconName: availableIconNames[0] || '' });
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage Skills" subtitle="Add, edit, or delete your skills." className="py-0 md:py-0 pb-8 text-left" />
        {!showForm && (
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{currentSkill ? 'Edit Skill' : 'Add New Skill'}</CardTitle>
            <CardDescription>Fill in the details for the skill.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form action={formAction}>
              {currentSkill?.id && <input type="hidden" {...form.register('id')} value={currentSkill.id} />}
              <CardContent className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skillCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="iconName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableIconNames.map(iconName => <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="proficiency" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency (0-100, optional)</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} /></FormControl>
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
          {skills.length === 0 && <p className="text-muted-foreground">No skills yet. Click "Add New Skill" to start.</p>}
          {skills.map(skill => {
            const IconComponent = lucideIconsMap[skill.iconName];
            return (
              <Card key={skill.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">({skill.category})</span>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
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
                          This action cannot be undone. This will permanently delete the skill "{skill.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(skill.id)}>
                          Yes, delete skill
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
