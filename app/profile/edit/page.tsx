'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function EditProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch fresh user data
      fetch(`/api/users?id=${user.id}`)
        .then(res => res.json())
        .then(data => {
            setFormData(data);
            setLoading(false);
        });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock implementation since we don't have a full UPDATE endpoint in the simple route
    // But I'll add a simple PATCH handler to api/users/route.ts next
    const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (res.ok) {
        router.push(`/profile/${user?.id}`);
    } else {
        alert('Failed to update profile');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" value={formData.name || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                className="input-field min-h-[100px]"
                value={formData.bio || ''}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input name="city" value={formData.city || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input name="category_tags" value={formData.category_tags || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <Input name="skills" value={formData.skills || ''} onChange={handleChange} />
            </div>
            <div className="pt-4">
                <Button type="submit" className="w-full">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
