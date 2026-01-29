'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardIndex() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'manager') {
      router.replace('/dashboard/manager');
    } else if (user?.role === 'engineer') {
      router.replace('/dashboard/engineer');
    }
  }, [user, router]);

  return null;
}
