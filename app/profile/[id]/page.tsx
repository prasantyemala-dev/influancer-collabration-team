'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, Youtube, Instagram, CheckCircle, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (id === 'me') {
       if (currentUser) {
         // Redirect to actual ID or just show current user data
         router.replace(`/profile/${currentUser.id}`);
       } else {
         // If not logged in, go to login
         // router.push('/login'); // Let auth provider handle this or show generic
       }
       return;
    }

    fetch(`/api/users?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setProfileUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, currentUser, router]);

  if (loading) return <div className="p-8 text-center">Loading Profile...</div>;
  if (!profileUser) return <div className="p-8 text-center">User not found</div>;

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="pb-20">
      {/* Cover / Header */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-teal-600 h-32 relative">
         <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden">
              <img
                src={profileUser.profile_pic || `https://ui-avatars.com/api/?name=${profileUser.name}`}
                alt={profileUser.name}
                className="h-full w-full object-cover"
              />
            </div>
         </div>
      </div>

      <div className="pt-14 px-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {profileUser.name}
              {profileUser.verified && <CheckCircle size={18} className="ml-2 text-blue-500" fill="currentColor" color="white" />}
            </h1>
            <div className="flex items-center text-slate-500 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              {profileUser.city}, {profileUser.country}
            </div>
          </div>

          {isOwnProfile ? (
            <Link href="/profile/edit">
              <Button variant="outline" size="sm">Edit Profile</Button>
            </Link>
          ) : (
            <div className="flex space-x-2">
              <Link href={`/messages?to=${profileUser.id}`}>
                <Button variant="outline" size="sm">
                  <MessageSquare size={18} />
                </Button>
              </Link>
              <Link href={`/collab-request?to=${profileUser.id}`}>
                <Button size="sm">Collab</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {/* Bio */}
          <section>
            <h2 className="font-semibold text-lg mb-2">About</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {profileUser.bio || "No bio provided."}
            </p>
          </section>

          {/* Tags */}
          <section>
            <div className="flex flex-wrap gap-2">
              {profileUser.category_tags?.split(',').map((tag: string) => (
                <span key={tag} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </section>

          {/* Stats / Info */}
          <div className="grid grid-cols-2 gap-4">
             <Card>
               <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                 <Youtube size={24} className="text-red-600 mb-2" />
                 <div className="text-sm font-medium">Subscribers</div>
                 <div className="text-xs text-slate-500">{profileUser.subscriber_range || "Hidden"}</div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                 <Calendar size={24} className="text-[var(--color-secondary)] mb-2" />
                 <div className="text-sm font-medium">Joined</div>
                 <div className="text-xs text-slate-500">
                    {new Date(profileUser.created_at).toLocaleDateString(undefined, {month: 'short', year: 'numeric'})}
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Skills */}
           <section>
            <h2 className="font-semibold text-lg mb-2">Skills</h2>
             <div className="flex flex-wrap gap-2">
              {profileUser.skills?.split(',').map((skill: string) => (
                <span key={skill} className="border border-slate-200 text-slate-600 text-xs px-3 py-1 rounded-lg">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
