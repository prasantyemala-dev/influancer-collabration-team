'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';

function MessagesContent() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toUserId = searchParams.get('to');

  useEffect(() => {
      if (!user) return;

      // If ?to=userid param exists, find/create thread and redirect
      if (toUserId) {
          fetch(`/api/messages?userId=${user.id}&toUserId=${toUserId}`)
            .then(res => res.json())
            .then(data => {
                router.replace(`/messages/${data.threadId}`);
            });
          return;
      }

      fetch(`/api/messages?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setThreads(data);
          setLoading(false);
        });
  }, [user, toUserId, router]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!toUserId && threads.length === 0) return <div className="p-8 text-center text-slate-500">No messages yet.</div>;
  if (toUserId) return <div className="p-8 text-center">Starting chat...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 px-2">Messages</h1>
      <div className="space-y-2">
        {threads.map((thread) => {
          const otherUser = thread.participants.find((p: any) => p.id !== user?.id);
          return (
            <Link key={thread.id} href={`/messages/${thread.id}`}>
              <Card className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img src={otherUser?.profile_pic} alt={otherUser?.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold truncate">{otherUser?.name}</h3>
                      <span className="text-xs text-slate-400 shrink-0">
                         {new Date(thread.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{thread.last_message_preview}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Messages() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MessagesContent />
        </Suspense>
    );
}
