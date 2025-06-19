
"use client";

import { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebaseConfig';
import { collection, onSnapshot, query, orderBy, limit, Timestamp as FirestoreTimestamp } from 'firebase/firestore';
import type { Announcement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FetchedAnnouncement extends Omit<Announcement, 'createdAt'> {
  createdAt: FirestoreTimestamp;
}

const AUTO_HIDE_DELAY = 15000; // 15 seconds

export default function LiveAnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!firestore) {
      console.warn("LiveAnnouncementBanner: Firestore not initialized.");
      return;
    }

    const q = query(
      collection(firestore, 'announcements'), 
      orderBy('createdAt', 'desc'), 
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as FetchedAnnouncement;
        
        // Show announcement if it's active (or isActive is undefined, defaulting to active)
        if (data.isActive !== false) { 
          const newAnnouncement: Announcement = {
            id: doc.id,
            message: data.message,
            createdAt: data.createdAt.toDate(),
            isActive: data.isActive,
          };
          
          // Update state only if it's a truly new/different announcement to avoid unnecessary re-renders/timer resets
          if (!announcement || 
              announcement.id !== newAnnouncement.id || 
              announcement.message !== newAnnouncement.message ||
              (announcement.createdAt && newAnnouncement.createdAt && announcement.createdAt.getTime() !== newAnnouncement.createdAt.getTime())
            ) {
            setAnnouncement(newAnnouncement);
            setIsVisible(true); // Show the banner when a new announcement comes in
          }
        } else {
          // If announcement is explicitly not active, ensure it's hidden
          if (announcement && announcement.id === doc.id) { // Only hide if it's the current one being deactivated
            setAnnouncement(null);
            setIsVisible(false);
          }
        }
      } else {
        // No announcements found
        setAnnouncement(null);
        setIsVisible(false);
      }
    }, (error) => {
      console.error("Error fetching live announcements:", error);
      setAnnouncement(null);
      setIsVisible(false);
    });

    return () => unsubscribe();
  }, [announcement]); // Re-subscribe if the current announcement state changes (e.g., cleared)

  // Timer useEffect
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (isVisible && announcement) {
      timerId = setTimeout(() => {
        setIsVisible(false); // Hide the banner after the delay
      }, AUTO_HIDE_DELAY);
    }

    // Cleanup function: this will run when the component unmounts
    // or when any of the dependencies (isVisible, announcement) change.
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isVisible, announcement]); // Rerun effect if visibility or the announcement itself changes

  const handleDismiss = () => {
    setIsVisible(false); // This will also trigger the cleanup of the timer useEffect
  };

  if (!isVisible || !announcement) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] p-3 bg-accent text-accent-foreground shadow-md transition-all duration-500 ease-in-out",
        "flex items-center justify-between gap-4",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">{announcement.message}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="h-7 w-7 p-1 text-accent-foreground hover:bg-accent/80"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
