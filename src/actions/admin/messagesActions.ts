
"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { ContactMessage } from '@/lib/types';

const messagesFilePath = path.join(process.cwd(), 'src', 'lib', 'contact-messages.json');

async function readMessagesFromFile(): Promise<ContactMessage[]> {
  try {
    const fileContent = await fs.readFile(messagesFilePath, 'utf-8');
    if (!fileContent.trim()) {
        return [];
    }
    return JSON.parse(fileContent) as ContactMessage[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, which is fine, return empty array
      return [];
    }
    console.error("Error reading contact messages file:", error);
    // In case of other errors (e.g., malformed JSON), return empty or handle appropriately
    return []; 
  }
}

async function writeMessagesToFile(messages: ContactMessage[]): Promise<void> {
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
}

export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  const messages = await readMessagesFromFile();
  // Already stored in reverse chronological order, but can sort again to be sure
  return messages.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export type DeleteMessageResult = {
    success: boolean;
    message: string;
};

export async function deleteContactMessageAction(messageId: string): Promise<DeleteMessageResult> {
    if (!messageId) {
        return { success: false, message: "No message ID provided for deletion." };
    }
    try {
        let messages = await readMessagesFromFile();
        const initialLength = messages.length;
        messages = messages.filter(msg => msg.id !== messageId);

        if (messages.length < initialLength) {
            await writeMessagesToFile(messages);
            revalidatePath('/admin/messages');
            return { success: true, message: `Message (ID: ${messageId}) deleted successfully!` };
        } else {
            return { success: false, message: `Message (ID: ${messageId}) not found.` };
        }
    } catch (error) {
        console.error("Error deleting contact message:", error);
        return { success: false, message: "Failed to delete message due to a server error." };
    }
}
