
"use client";

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { getContactMessagesAction, deleteContactMessageAction, type DeleteMessageResult } from '@/actions/admin/messagesActions';
import type { ContactMessage } from '@/lib/types';
import { Trash2, Mail, CalendarDays, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import FullScreenLoader from '@/components/shared/FullScreenLoader';

// Client Component to handle state and interactions
function MessagesAdminClientPage({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const { toast } = useToast();

  const handleDeleteMessage = async (messageId: string) => {
    const result = await deleteContactMessageAction(messageId);
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    } else {
      toast({ title: "Error Deleting", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Messages" subtitle="Messages received from your site visitors." className="py-0 text-left" />
      
      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Inbox className="mx-auto h-12 w-12 mb-4" />
            <p>No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <Card key={msg.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>From: {msg.name}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this message.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteMessage(msg.id)} className="bg-destructive hover:bg-destructive/90">
                          Yes, delete message
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground space-y-1 pt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" /> <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3 w-3" /> {format(new Date(msg.submittedAt), "PPP p")}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Parent Server Component to fetch initial data
export default async function AdminMessagesPage() {
  const initialMessages = await getContactMessagesAction();
  return <MessagesAdminClientPage initialMessages={initialMessages} />;
}
