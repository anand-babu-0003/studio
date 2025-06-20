
"use client";

import { useEffect, useState, useMemo } from 'react'; 
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; 
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Edit3, Trash2, Save, Loader2, XCircle, Package } from 'lucide-react'; 

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import FullScreenLoader from '@/components/shared/FullScreenLoader';

import { 
  skillCategories, 
  lucideIconsMap, 
  commonSkillNames, // Use the expanded commonSkillNames
  defaultSkillsDataForClient
} from '@/lib/data';
import type { Skill } from '@/lib/types';
import { 
  getSkillsAction, 
  saveSkillAction, 
  deleteSkillAction, 
  type SkillFormState 
} from '@/actions/admin/skillsActions';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';

const initialFormState: SkillFormState = { message: '', status: 'idle', errors: {}, formDataOnError: undefined, savedSkill: undefined };

const defaultFormValues: SkillAdminFormData = {
  id: undefined,
  name: commonSkillNames.length > 0 ? commonSkillNames[0] : '', // Default to first common skill or empty
  category: skillCategories[0], 
  proficiency: undefined, 
  // iconName is no longer part of SkillAdminFormData
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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
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
    if (currentSkill?.id) return `edit-${currentSkill.id}-${new Date().getTime()}`;
    return `add-new-skill-form-${new Date().getTime()}`;
  }, [showForm, currentSkill]);

  useEffect(() => {
    async function fetchSkills() {
      setIsLoadingSkills(true);
      try {
        const fetchedSkills = await getSkillsAction();
        setSkills(fetchedSkills || []);
      } catch (error) {
        console.error("Failed to fetch skills for admin:", error);
        toast({
          title: "Error Loading Skills",
          description: "Could not load skills from the database.",
          variant: "destructive",
        });
        setSkills([]); 
      } finally {
        setIsLoadingSkills(false);
      }
    }
    fetchSkills();
  }, [toast]);


  useEffect(() => {
    if (formActionState.status === 'success' && formActionState.savedSkill) {
      const savedSkill = formActionState.savedSkill;
      toast({ title: "Success!", description: formActionState.message });

      setSkills(prevSkills => {
        const existingIndex = prevSkills.findIndex(s => s.id === savedSkill.id);
        let newSkillsArray;
        if (existingIndex > -1) {
          newSkillsArray = prevSkills.map(s => s.id === savedSkill.id ? savedSkill : s);
        } else {
          newSkillsArray = [savedSkill, ...prevSkills];
        }
        return newSkillsArray.sort((a, b) => {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
      });
      
      setShowForm(false);
      setCurrentSkill(null);
      form.reset(defaultFormValues);

    } else if (formActionState.status === 'error') {
      const errorMessage = typeof formActionState.message === 'string' && formActionState.message.trim() !== ''
        ? formActionState.message
        : "An unspecified error occurred.";
      toast({ title: "Error Saving", description: errorMessage, variant: "destructive" });
      
      const dataToResetWith = formActionState.formDataOnError ? formActionState.formDataOnError : form.getValues();
      form.reset(dataToResetWith);
      
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
      id: skill.id,
      name: skill.name || '',
      category: skill.category || skillCategories[0],
      // iconName is no longer part of form data
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
            <CardDescription>Select a skill and its details.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form action={dispatchServerAction}>
              {currentSkill?.id && <input type="hidden" {...form.register('id')} value={currentSkill.id} />}
              
              <CardContent className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a skill" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonSkillNames.map(skillName => (
                          <SelectItem key={skillName} value={skillName}>
                            {skillName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

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
                
                {/* Icon Selection Dropdown is REMOVED */}
                
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
                          value={value === null || value === undefined ? '' : String(value)} 
                          onChange={e => {
                            const val = e.target.value;
                            onChange(val === '' ? undefined : Number(val)); 
                          }}
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
         isLoadingSkills ? (
          <FullScreenLoader />
        ) : (
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
                    // Use skill.iconName (which is now derived and stored)
                    const IconComponent = lucideIconsMap[skill.iconName] || Package; 
                    return (
                      <Card key={skill.id} className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                          <span className="font-medium">{skill.name}</span>
                          {skill.proficiency !== undefined && skill.proficiency !== null && (
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
                                <AlertDialogAction onClick={() => handleDelete(skill.id)} className="bg-destructive hover:bg-destructive/80">
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
        )
      )}
    </div>
  );
}
