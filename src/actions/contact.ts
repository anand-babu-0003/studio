"use server";

import { z } from 'zod';

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
    // Simulate sending an email or saving to a database
    console.log("New contact form submission:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    
    // In a real application, you would integrate with an email service (e.g., SendGrid, Resend)
    // or save the data to a database here.
    // For example:
    // await sendEmail({ to: 'your-email@example.com', from: email, subject: `New message from ${name}`, text: message });

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    return {
      message: "Your message has been sent successfully! I'll get back to you soon.",
      status: 'success',
    };

  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      status: 'error',
    };
  }
}
