'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Send } from 'lucide-react';

export default function ChatPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch
    fetch(`/api/messages?threadId=${threadId}`)
      .then(res => res.json())
      .then(setMessages);

    // Simple polling every 5s for new messages (MVP)
    const interval = setInterval(() => {
        fetch(`/api/messages?threadId=${threadId}`)
        .then(res => res.json())
        .then(setMessages);
    }, 5000);

    return () => clearInterval(interval);
  }, [threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const otherUserId = messages.length > 0
        ? (messages[0].from_user_id === user.id ? messages[0].to_user_id : messages[0].from_user_id)
        // Fallback if no messages yet: we need to know who we are talking to.
        // Ideally the thread object should be fetched separately to know participants.
        // For MVP, we assume if thread exists, previous messages exist OR we rely on optimistic update and wait for poll.
        // Actually, let's rely on the fact that if we are here, the thread exists.
        // But we need `to_user_id` for the API.
        : null;

    // If no messages, we need to fetch thread details to know participant.
    // Let's just fetch thread details first if empty.
    let targetId = otherUserId;
    if (!targetId) {
         // This case happens if new thread with no messages.
         // We should fetch thread participants.
         // But for now, let's assume the previous screen passed us to a thread that has at least one message (system message "Started a chat").
         // The "Started a chat" message is created in API.
    }

    // Wait, let's check the `api/messages` logic. Creating a thread creates a message? Yes.
    // So `messages` array should not be empty.
    // Find the other user from the first message.
    if (!targetId && messages.length > 0) {
         const msg = messages[0];
         targetId = msg.from_user_id === user.id ? msg.to_user_id : msg.from_user_id;
    }

    if (!targetId) return;

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread_id: threadId,
        from_user_id: user.id,
        to_user_id: targetId,
        text: newMessage,
      }),
    });

    setNewMessage('');
    // Refresh immediately
    fetch(`/api/messages?threadId=${threadId}`)
      .then(res => res.json())
      .then(setMessages);
  };

  return (
    <div className="flex flex-col h-screen pb-20 bg-slate-50">
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map((msg) => {
           const isMe = msg.from_user_id === user?.id;
           return (
             <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[75%] p-3 rounded-xl text-sm ${isMe ? 'bg-[var(--color-primary)] text-white rounded-br-none' : 'bg-white border border-slate-200 rounded-bl-none'}`}>
                 {msg.text}
               </div>
             </div>
           );
         })}
         <div ref={messagesEndRef} />
       </div>

       <div className="bg-white p-4 border-t border-slate-200">
         <form onSubmit={handleSend} className="flex space-x-2">
           <Input
             value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}
             placeholder="Type a message..."
             className="flex-1"
           />
           <Button type="submit" size="md" className="rounded-full w-12 px-0 flex items-center justify-center">
             <Send size={20} />
           </Button>
         </form>
       </div>
    </div>
  );
}
