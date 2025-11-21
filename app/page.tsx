'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPin, DollarSign, Filter, Search } from 'lucide-react';
import Link from 'next/link';

// Load Map dynamically to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'nearby' | 'opportunities'>('nearby');
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setUsers);
    fetch('/api/posts').then(res => res.json()).then(setPosts);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.category_tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Search city, skill, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="px-3">
            <Filter size={20} />
          </Button>
        </div>

        <div className="flex space-x-4 border-b">
          <button
            className={`pb-2 px-4 font-medium ${activeTab === 'nearby' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-slate-500'}`}
            onClick={() => setActiveTab('nearby')}
          >
            Nearby Map
          </button>
          <button
             className={`pb-2 px-4 font-medium ${activeTab === 'opportunities' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-slate-500'}`}
            onClick={() => setActiveTab('opportunities')}
          >
            Opportunities
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'nearby' ? (
          <div className="h-full w-full relative">
            <MapComponent users={filteredUsers} />
             {/* Floating list toggle or quick list view could go here */}
             <div className="absolute bottom-4 left-4 right-4 z-[400] flex space-x-2 overflow-x-auto pb-2 snap-x">
                {filteredUsers.slice(0, 5).map(u => (
                  <Link key={u.id} href={`/profile/${u.id}`} className="snap-center shrink-0">
                    <div className="bg-white p-3 rounded-lg shadow-lg w-48 flex items-center space-x-3">
                       <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                         <img src={u.profile_pic || `https://ui-avatars.com/api/?name=${u.name}`} alt={u.name} />
                       </div>
                       <div className="overflow-hidden">
                         <div className="font-bold text-sm truncate">{u.name}</div>
                         <div className="text-xs text-slate-500 truncate">{u.category_tags}</div>
                       </div>
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {filteredPosts.length === 0 ? (
               <div className="text-center py-10 text-slate-500">No opportunities found.</div>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg">{post.title}</h3>
                       {post.pay_amount && (
                         <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded flex items-center">
                           <DollarSign size={12} className="mr-1" /> {post.pay_amount}
                         </span>
                       )}
                    </div>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{post.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-slate-500 text-xs">
                        <MapPin size={14} className="mr-1" /> {post.city}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                       <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden">
                              <img src={post.creator?.profile_pic} alt="" />
                          </div>
                          <span className="text-xs font-medium">{post.creator?.name}</span>
                       </div>
                       <Link href={`/messages?to=${post.creator_id}&post=${post.id}`}>
                         <Button size="sm" variant="secondary">Apply</Button>
                       </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
