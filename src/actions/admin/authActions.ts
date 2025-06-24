
"use server";

import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
};

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      status: 'error',
    };
  }
  
  const { email, password } = validatedFields.data;

  // IMPORTANT: This is a basic authentication mechanism using environment variables.
  // It is NOT a substitute for a proper authentication system like Firebase Auth, NextAuth.js, etc.
  // It is intended for simple, single-user admin panels where high security is not the primary concern.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set.");
    return {
      message: "Server configuration error. Cannot process login.",
      status: 'error',
    };
  }

  if (email === adminEmail && password === adminPassword) {
    return {
      message: "Login successful!",
      status: 'success',
    };
  } else {
    return {
      message: "Invalid email or password.",
      status: 'error',
    };
  }
}
