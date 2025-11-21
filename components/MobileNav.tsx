'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Home, PlusCircle, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const pathname = usePathname();

  // Don't show on onboarding or auth pages
  if (['/onboarding', '/login', '/signup'].includes(pathname)) {
    return null;
  }

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/map', label: 'Map', icon: Map },
    { href: '/opportunities/new', label: 'Post', icon: PlusCircle },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile/me', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs space-y-1",
                isActive ? "text-[var(--color-primary)]" : "text-slate-500"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
