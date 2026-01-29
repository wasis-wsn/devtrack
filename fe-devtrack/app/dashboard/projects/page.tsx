'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatStatus, formatDate, getStatusColor } from '@/lib/formatters';
import CreateProjectDialog from '@/components/dialogs/CreateProjectDialog';

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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

  const handleCreateSuccess = async () => {
    setShowCreateDialog(false);
    const data = await api.getProjects();
    setProjects(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        {user?.role === 'manager' && (
          <Button onClick={() => setShowCreateDialog(true)}>Create Project</Button>
        )}
      </div>

      {showCreateDialog && (
        <CreateProjectDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const colorClass = getStatusColor(project.status);
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <button
                          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                          className="text-blue-600 hover:underline text-left"
                        >
                          {project.name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge className={colorClass}>
                          {formatStatus(project.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(project.start_date)}</TableCell>
                      <TableCell>{formatDate(project.end_date)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
