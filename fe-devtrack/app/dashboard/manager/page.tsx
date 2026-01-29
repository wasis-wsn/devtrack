'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManagerDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalProjects = projects.length;
  const inProgress = projects.filter((p) => p.status === 'in_progress').length;
  const finished = projects.filter((p) => p.status === 'finished').length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manager Dashboard</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Finished</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{finished}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
