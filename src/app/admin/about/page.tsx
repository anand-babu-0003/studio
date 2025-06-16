
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { aboutMe as initialAboutMeData } from '@/lib/data'; // Import the initial data

type AboutMeData = typeof initialAboutMeData;

export default function AdminAboutPage() {
  const [formData, setFormData] = useState<AboutMeData>(initialAboutMeData);
  const [isSaving, setIsSaving] = useState(false);

  // Effect to load data if it changes elsewhere (though not strictly necessary with current static import)
  useEffect(() => {
    setFormData(initialAboutMeData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newExperience = [...formData.experience];
    // @ts-ignore
    newExperience[index][name] = value;
    setFormData(prev => ({ ...prev, experience: newExperience }));
  };
  
  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newEducation = [...formData.education];
    // @ts-ignore
    newEducation[index][name] = value;
    setFormData(prev => ({ ...prev, education: newEducation }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    console.log("Saving data:", formData);
    // In a real application, you would call a server action here to save the data
    // For example: await updateAboutMeData(formData);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsSaving(false);
    // Potentially show a success toast/message
    alert("Changes saved (logged to console). Implement actual saving to see persistent changes.");
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <PageHeader 
          title="Manage About Page" 
          subtitle="Edit your bio, profile, experience, and education details." 
          className="py-0 md:py-0 text-left" 
        />
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" /> 
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Details Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your name, title, and profile picture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title / Tagline</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input id="profileImage" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="https://placehold.co/400x400.png" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataAiHint">Profile Image AI Hint</Label>
              <Input id="dataAiHint" name="dataAiHint" value={formData.dataAiHint} onChange={handleChange} placeholder="e.g., developer portrait" />
            </div>
          </CardContent>
        </Card>

        {/* Bio Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Bio</CardTitle>
            <CardDescription>Tell your story. This will appear on your About page and homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="bio">Biography</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              rows={10} 
              placeholder="Write about yourself..."
              className="mt-1"
            />
          </CardContent>
        </Card>

        {/* Experience Section - Placeholder for now */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
            <CardDescription>Manage your professional experience. (Full editing coming soon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 border rounded-md">
                <p className="font-semibold">{exp.role} at {exp.company}</p>
                <p className="text-sm text-muted-foreground">{exp.period}</p>
                <p className="mt-1 text-sm">{exp.description}</p>
                {/* Add input fields here for editing in a future step */}
              </div>
            ))}
            <Button variant="outline" disabled>Add New Experience (Coming Soon)</Button>
          </CardContent>
        </Card>

        {/* Education Section - Placeholder for now */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Manage your academic background. (Full editing coming soon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={edu.id} className="p-4 border rounded-md">
                <p className="font-semibold">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.institution} | {edu.period}</p>
                {/* Add input fields here for editing in a future step */}
              </div>
            ))}
            <Button variant="outline" disabled>Add New Education (Coming Soon)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
