
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
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

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
        
        if (data.isActive !== false) {
          const newAnnouncement: Announcement = {
            id: doc.id,
            message: data.message,
            createdAt: data.createdAt.toDate(),
            isActive: data.isActive,
          };
          
          // If it's a new announcement or different message, show it
          if (!announcement || announcement.id !== newAnnouncement.id || announcement.message !== newAnnouncement.message) {
            setAnnouncement(newAnnouncement);
            setIsVisible(true);
          } else if (announcement && announcement.id === newAnnouncement.id && !isVisible) {
            // Potentially re-show if it's the same but was dismissed, though auto-hide might make this less relevant
            // setIsVisible(true); // Optional: re-trigger visibility if needed
          }
        } else {
          setAnnouncement(null);
          setIsVisible(false);
        }
      } else {
        setAnnouncement(null);
        setIsVisible(false);
      }
    }, (error) => {
      console.error("Error fetching live announcements:", error);
      setAnnouncement(null);
      setIsVisible(false);
    });

    return () => unsubscribe();
  }, [announcement]); // Rerun if current announcement changes to allow for updates

  useEffect(() => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }

    if (isVisible && announcement) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, AUTO_HIDE_DELAY);
      setHideTimer(timer);
    }

    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, announcement]); // Re-run if visibility or announcement changes

  const handleDismiss = () => {
    setIsVisible(false);
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
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
