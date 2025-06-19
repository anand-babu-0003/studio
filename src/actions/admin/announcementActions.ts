
"use server";

import { z } from 'zod';
import { firestore } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache'; // Though not strictly needed for live updates, good practice

const announcementSchema = z.object({
  message: z.string().min(5, { message: "Announcement message must be at least 5 characters long." }).max(500, { message: "Announcement cannot exceed 500 characters." }),
});

export type AnnouncementFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: {
    message?: string[];
  };
};

export async function submitAnnouncementAction(
  prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {

  if (!firestore) {
    console.error("CRITICAL_ERROR: Firestore is not initialized in announcementActions.ts.");
    return {
      message: "System error: Database not configured. Please try again later.",
      status: 'error',
    };
  }

  const validatedFields = announcementSchema.safeParse({
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: "Failed to publish announcement. Please check the errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { message } = validatedFields.data;

  try {
    const announcementsCollection = collection(firestore, 'announcements');
    await addDoc(announcementsCollection, {
      message,
      createdAt: serverTimestamp(),
      isActive: true, // Default to active
    });

    // Revalidate relevant paths if needed, though onSnapshot handles client updates
    // revalidatePath('/'); 

    return {
      message: "Announcement published successfully!",
      status: 'success',
    };

  } catch (error) {
    console.error("Error publishing announcement to Firestore:", error);
    return {
      message: "An unexpected error occurred while publishing the announcement. Please try again later.",
      status: 'error',
    };
  }
}
