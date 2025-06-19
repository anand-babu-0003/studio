
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, getDocs, doc, deleteDoc, query, orderBy, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { ContactMessage } from '@/lib/types';

const messagesCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'contactMessages');
}

const messageDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'contactMessages', id);
}

export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getContactMessagesAction. Returning empty array.");
    return [];
  }
  try {
    const q = query(messagesCollectionRef(), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || 'N/A',
        email: data.email || 'N/A',
        message: data.message || '',
        submittedAt: data.submittedAt instanceof Timestamp 
                       ? data.submittedAt.toDate().toISOString() 
                       : new Date().toISOString(), // Fallback, should ideally not happen
      } as ContactMessage;
    });
  } catch (error) {
    console.error("Error fetching contact messages from Firestore:", error);
    return []; 
  }
}

export type DeleteMessageResult = {
    success: boolean;
    message: string;
};

export async function deleteContactMessageAction(messageId: string): Promise<DeleteMessageResult> {
    if (!messageId) {
        return { success: false, message: "No message ID provided for deletion." };
    }
    if (!firestore) {
      return { success: false, message: "Firestore not initialized. Cannot delete message." };
    }
    try {
        await deleteDoc(messageDocRef(messageId));
        revalidatePath('/admin/messages');
        return { success: true, message: `Message (ID: ${messageId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting contact message from Firestore:", error);
        return { success: false, message: "Failed to delete message due to a server error." };
    }
}

// Note: The submitContactForm action is in src/actions/contact.ts
// It will also need to use Firestore (addDoc to contactMessages collection).
