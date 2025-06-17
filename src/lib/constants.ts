// src/lib/constants.ts

// Define a single source of truth for skill categories
export const SKILL_CATEGORIES = ['Languages', 'Frontend', 'Backend', 'DevOps', 'Tools', 'Other'] as const;
// Note: 'as const' makes it a readonly tuple of string literals, suitable for z.enum

// You can add other app-wide constants here as needed.
