'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

function CollabRequestContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toUserId = searchParams.get('to');
  const postId = searchParams.get('post');

  const [formData, setFormData] = useState({
    message: '',
    proposed_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !toUserId) return;

    const res = await fetch('/api/collab-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_user_id: user.id,
        to_user_id: toUserId,
        post_id: postId,
        message: formData.message,
        proposed_date: formData.proposed_date,
      }),
    });

    if (res.ok) {
      router.push('/messages');
    } else {
      alert('Failed to send request');
    }
  };

  if (!toUserId) return <div className="p-8">Invalid Request</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Collab Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="input-field min-h-[100px]"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Hi, I'd like to collaborate..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Proposed Date</label>
            <Input
              type="date"
              value={formData.proposed_date}
              onChange={(e) => setFormData({...formData, proposed_date: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full mt-4">Send Request</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function CollabRequest() {
    return (
        <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <Suspense fallback={<div>Loading...</div>}>
                    <CollabRequestContent />
                </Suspense>
            </div>
        </div>
    );
}
