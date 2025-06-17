
"use server";

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
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

const messagesFilePath = path.join(process.cwd(), 'src', 'lib', 'contact-messages.json');

async function readMessages(): Promise<ContactMessage[]> {
  try {
    const fileContent = await fs.readFile(messagesFilePath, 'utf-8');
    return JSON.parse(fileContent) as ContactMessage[];
  } catch (error) {
    // If file doesn't exist or is invalid JSON, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error("Error reading messages file:", error);
    return [];
  }
}

async function writeMessages(messages: ContactMessage[]): Promise<void> {
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
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
    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    };

    const existingMessages = await readMessages();
    existingMessages.unshift(newMessage); // Add to the beginning for reverse chrono order
    await writeMessages(existingMessages);
    
    console.log("New contact form submission saved:", newMessage.id);

    return {
      message: "Your message has been sent successfully! I'll get back to you soon.",
      status: 'success',
    };

  } catch (error) {
    console.error("Error submitting contact form or saving message:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      status: 'error',
    };
  }
}
