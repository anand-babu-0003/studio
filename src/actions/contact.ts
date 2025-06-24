
"use server";

import { z } from 'zod';
import { firestore } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { ContactMessage } from '@/lib/types';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  if (!firestore) {
    return {
      message: "System error: Database not configured. Please try again later.",
      status: 'error',
    };
  }

  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: "Failed to send message. Please check the errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    const messagesCollection = collection(firestore, 'contactMessages');
    const newMessageData = {
      name,
      email,
      message,
      submittedAt: serverTimestamp(), // Use Firestore server timestamp
    };

    await addDoc(messagesCollection, newMessageData);

    return {
      message: "Your message has been sent successfully! I'll get back to you soon.",
      status: 'success',
    };

  } catch (error) {
    console.error("Error submitting contact form or saving message to Firestore:", error);
    return {
      message: "An unexpected error occurred while sending your message. Please try again later.",
      status: 'error',
    };
  }
}
