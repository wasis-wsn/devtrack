'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isManager = user.role === 'manager';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold">DevTrack</h1>
            <p className="text-sm text-gray-500">{user.name} • {user.role}</p>
          </div>
          <nav className="space-y-2">
            <Link href={isManager ? '/dashboard/manager' : '/dashboard/engineer'} className="block px-3 py-2 rounded hover:bg-gray-100">
              Dashboard
            </Link>
            <Link href="/dashboard/projects" className="block px-3 py-2 rounded hover:bg-gray-100">
              Projects
            </Link>
            <Link href="/dashboard/issues" className="block px-3 py-2 rounded hover:bg-gray-100">
              Issues
            </Link>
            <Link href="/dashboard/reports" className="block px-3 py-2 rounded hover:bg-gray-100">
              Reports
            </Link>
          </nav>
          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={logout}>
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
