'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function NewOpportunity() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pay_amount: '',
    city: user?.city || '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        creator_id: user.id,
        lat: user.lat || 0,
        lng: user.lng || 0,
      }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Failed to create post');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Post an Opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Drone Operator needed"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="input-field min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Details about the gig..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pay Amount (Optional)</label>
              <Input
                value={formData.pay_amount}
                onChange={(e) => setFormData({...formData, pay_amount: e.target.value})}
                placeholder="e.g. ₹2000 or Collab"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g. Drone, Camera, Editing"
              />
            </div>

            <Button type="submit" className="w-full mt-4">Post Opportunity</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
