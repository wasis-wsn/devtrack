'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatStatus, formatType, getPriorityLabel, getPriorityColor, getStatusColor, getTypeColor } from '@/lib/formatters';
import CreateIssueDialog from '@/components/dialogs/CreateIssueDialog';
import AssignIssueDialog from '@/components/dialogs/AssignIssueDialog';
import UpdateStatusDialog from '@/components/dialogs/UpdateStatusDialog';
import LogWorkDialog from '@/components/dialogs/LogWorkDialog';
import { Eye, Edit, Clock } from 'lucide-react';

export default function IssuesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showLogWork, setShowLogWork] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

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

  const loadIssues = async (projectId: string) => {
    setSelectedProject(projectId);
    const data = await api.getProjectIssues(Number(projectId));
    setIssues(data);
  };

  const handleCreateIssueSuccess = async () => {
    setShowCreateDialog(false);
    if (selectedProject) {
      const data = await api.getProjectIssues(Number(selectedProject));
      setIssues(data);
    }
  };

  const handleAssignIssueSuccess = async () => {
    setShowAssignDialog(false);
    setSelectedIssue(null);
    if (selectedProject) {
      const data = await api.getProjectIssues(Number(selectedProject));
      setIssues(data);
    }
  };

  const handleUpdateStatusSuccess = async () => {
    setShowUpdateStatus(false);
    setSelectedIssue(null);
    if (selectedProject) {
      const data = await api.getProjectIssues(Number(selectedProject));
      setIssues(data);
    }
  };

  const handleLogWorkSuccess = async () => {
    setShowLogWork(false);
    setSelectedIssue(null);
    if (selectedProject) {
      const data = await api.getProjectIssues(Number(selectedProject));
      setIssues(data);
    }
  };

  const openAssignDialog = (issue: any) => {
    setSelectedIssue(issue);
    setShowAssignDialog(true);
  };

  const openUpdateStatus = (issue: any) => {
    setSelectedIssue(issue);
    setShowUpdateStatus(true);
  };

  const openLogWork = (issue: any) => {
    setSelectedIssue(issue);
    setShowLogWork(true);
  };

  const isAssigned = (issue: any) => user?.id === issue.assigned_to;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Issues</h2>
        {user?.role === 'manager' && selectedProject && (
          <Button onClick={() => setShowCreateDialog(true)}>Create Issue</Button>
        )}
      </div>

      {showCreateDialog && (
        <CreateIssueDialog
          projectId={Number(selectedProject)}
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleCreateIssueSuccess}
        />
      )}

      {showAssignDialog && selectedIssue && (
        <AssignIssueDialog
          issue={selectedIssue}
          isOpen={showAssignDialog}
          onClose={() => setShowAssignDialog(false)}
          onSuccess={handleAssignIssueSuccess}
        />
      )}

      {showUpdateStatus && selectedIssue && (
        <UpdateStatusDialog
          issue={selectedIssue}
          isOpen={showUpdateStatus}
          onClose={() => setShowUpdateStatus(false)}
          onSuccess={handleUpdateStatusSuccess}
        />
      )}

      {showLogWork && selectedIssue && (
        <LogWorkDialog
          issueId={selectedIssue.id}
          issueTitle={selectedIssue.title}
          isOpen={showLogWork}
          onClose={() => setShowLogWork(false)}
          onSuccess={handleLogWorkSuccess}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Select value={selectedProject} onValueChange={loadIssues}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <button
                        onClick={() => router.push(`/dashboard/issues/${issue.id}`)}
                        className="text-blue-600 hover:underline text-left"
                      >
                        {issue.title}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(issue.type)}>
                        {formatType(issue.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(issue.status)}>
                        {formatStatus(issue.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {getPriorityLabel(issue.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>{issue.assignee?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/issues/${issue.id}`)}
                          title="View Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user?.role === 'manager' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAssignDialog(issue)}
                          >
                            Assign
                          </Button>
                        )}
                        {user?.role === 'engineer' && isAssigned(issue) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openUpdateStatus(issue)}
                              title="Update Status"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openLogWork(issue)}
                              title="Log Work"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
