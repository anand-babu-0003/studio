
"use client";

import { useEffect, useState, useMemo } from 'react'; 
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; 
import { useForm, type Path, type SubmitHandler } from 'react-hook-form';
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

import { skills as initialSkillsData, skillCategories, availableIconNames, lucideIconsMap, commonSkillNames } from '@/lib/data';
import type { Skill } from '@/lib/types';
import { saveSkillAction, deleteSkillAction, type SkillFormState } from '@/actions/admin/skillsActions';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';

const initialFormState: SkillFormState = { message: '', status: 'idle', errors: {}, formDataOnError: undefined, savedSkill: undefined };

const defaultFormValues: SkillAdminFormData = {
  name: '',
  category: skillCategories[0], 
  proficiency: undefined,
  iconName: availableIconNames.length > 0 ? availableIconNames[0] : (() => { throw new Error("FATAL: availableIconNames is empty. Check src/lib/data.ts and lucide-react imports for AdminSkillsPage.")})(),
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

  const [formActionState, dispatchServerAction] = useActionState(saveSkillAction, initialFormState);

  const form = useForm<SkillAdminFormData>({
    resolver: zodResolver(skillAdminSchema),
    defaultValues: defaultFormValues,
  });

  const formCardKey = useMemo(() => {
    if (!showForm) return 'hidden-form';
    if (currentSkill) return `edit-${currentSkill.id}-${new Date().getTime()}`;
    return `add-new-skill-form-${new Date().getTime()}`;
  }, [showForm, currentSkill]);


  useEffect(() => {
    if (formActionState.status === 'success' && formActionState.savedSkill) {
      const savedSkill = formActionState.savedSkill;
      toast({ title: "Success!", description: formActionState.message });

      setSkills(prevSkills => {
        const existingIndex = prevSkills.findIndex(s => s.id === savedSkill.id);
        let newSkillsArray;
        if (existingIndex > -1) {
          const updatedSkills = [...prevSkills];
          updatedSkills[existingIndex] = savedSkill;
          newSkillsArray = updatedSkills;
        } else {
          newSkillsArray = [...prevSkills, savedSkill];
        }
        return newSkillsArray;
      });
      
      setShowForm(false);
      setCurrentSkill(null);
      form.reset(defaultFormValues);

    } else if (formActionState.status === 'error') {
      const errorMessage = typeof formActionState.message === 'string' && formActionState.message.trim() !== ''
        ? formActionState.message
        : "An unspecified error occurred. Please check server logs for more details.";
      toast({ title: "Error Saving", description: errorMessage, variant: "destructive" });
      
      if (formActionState.formDataOnError) {
        form.reset(formActionState.formDataOnError); 
      } else {
        form.reset(form.getValues()); 
      }
      
      if (formActionState.errors) {
        Object.entries(formActionState.errors).forEach(([key, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            form.setError(key as Path<SkillAdminFormData>, { 
              type: 'server', 
              message: fieldErrorMessages.join(', ') 
            });
          }
        });
      }
    }
  }, [formActionState, toast, form]);

  const handleAddNew = () => {
    setCurrentSkill(null);
    form.reset(defaultFormValues);
    setShowForm(true);
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    form.reset({ 
      ...skill,
      proficiency: skill.proficiency ?? undefined, 
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
    form.reset(defaultFormValues);
  }

  const handleFormSubmit: SubmitHandler<SkillAdminFormData> = async (data) => {
    const formData = new FormData();

    if (data.id) formData.append('id', data.id);
    formData.append('name', data.name || ''); 
    formData.append('category', data.category); 
    formData.append('iconName', data.iconName); 

    if (data.proficiency !== undefined && data.proficiency !== null) {
      formData.append('proficiency', String(data.proficiency));
    }
    
    dispatchServerAction(formData);
  };


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

      {showForm && (
        <Card key={formCardKey}> 
          <CardHeader>
            <CardTitle>{currentSkill ? 'Edit Skill' : 'Add New Skill'}</CardTitle>
            <CardDescription>Fill in the details for the skill.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              {currentSkill?.id && <input type="hidden" {...form.register('id')} value={currentSkill.id} />}
              
              <CardContent className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input {...field} list="common-skills-list" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <datalist id="common-skills-list">
                  {commonSkillNames.map(skillName => (
                    <option key={skillName} value={skillName} />
                  ))}
                </datalist>

                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                
                <FormField
                  control={form.control}
                  name="proficiency"
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <FormItem>
                      <FormLabel>Proficiency (0-100, optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          name={name}
                          value={value ?? ''} 
                          onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                          onBlur={onBlur}
                          ref={ref}
                          min="0"
                          max="100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
        <div className="space-y-8">
          {skills.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No skills yet. Click "Add New Skill" to start.
            </p>
          )}
          {skillCategories.map(category => {
            const categorySkills = skills.filter(skill => skill.category === category);
            if (categorySkills.length === 0) {
              return null; 
            }
            return (
              <div key={category}>
                <h2 className="text-2xl font-semibold mb-4 text-primary border-b pb-2">
                  {category}
                </h2>
                <div className="space-y-4">
                  {categorySkills.map(skill => {
                    const IconComponent = lucideIconsMap[skill.iconName];
                    return (
                      <Card key={skill.id} className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                          <span className="font-medium">{skill.name}</span>
                          {skill.proficiency !== undefined && (
                            <span className="text-sm text-muted-foreground">({skill.proficiency}%)</span>
                          )}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

