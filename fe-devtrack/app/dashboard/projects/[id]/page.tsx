'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatStatus, formatDate, formatType, getPriorityLabel, getPriorityColor, getStatusColor, getTypeColor } from '@/lib/formatters';
import CreateIssueDialog from '@/components/dialogs/CreateIssueDialog';
import AssignIssueDialog from '@/components/dialogs/AssignIssueDialog';
import UpdateStatusDialog from '@/components/dialogs/UpdateStatusDialog';
import LogWorkDialog from '@/components/dialogs/LogWorkDialog';
import { ArrowLeft, Eye, Edit, Clock } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateIssue, setShowCreateIssue] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showLogWork, setShowLogWork] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const loadProject = async () => {
    try {
      const projectData = await api.getProject(Number(params.id));
      setProject(projectData);
      
      const issuesData = await api.getProjectIssues(Number(params.id));
      setIssues(issuesData);
    } catch (err) {
      console.error('Failed to load project', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateIssue(false);
    loadProject();
  };

  const handleAssignSuccess = () => {
    setShowAssignDialog(false);
    setSelectedIssue(null);
    loadProject();
  };

  const handleUpdateStatusSuccess = () => {
    setShowUpdateStatus(false);
    setSelectedIssue(null);
    loadProject();
  };

  const handleLogWorkSuccess = () => {
    setShowLogWork(false);
    setSelectedIssue(null);
    loadProject();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Project not found</div>
      </div>
    );
  }

  const totalIssues = issues.length;
  const openIssues = issues.filter(i => i.status === 'open').length;
  const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;
  const doneIssues = issues.filter(i => i.status === 'done').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/projects')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      {showCreateIssue && (
        <CreateIssueDialog
          projectId={Number(params.id)}
          isOpen={showCreateIssue}
          onClose={() => setShowCreateIssue(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showAssignDialog && selectedIssue && (
        <AssignIssueDialog
          issue={selectedIssue}
          isOpen={showAssignDialog}
          onClose={() => setShowAssignDialog(false)}
          onSuccess={handleAssignSuccess}
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

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600 mt-1">
            Managed by {project.manager?.name || 'Unknown'}
          </p>
        </div>
        <Badge className={getStatusColor(project.status)}>
          {formatStatus(project.status)}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold w-32">Description:</span>
            <span>{project.description || 'No description'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold w-32">Start Date:</span>
            <span>{formatDate(project.start_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold w-32">End Date:</span>
            <span>{formatDate(project.end_date)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalIssues}</div>
            <p className="text-sm text-gray-600">Total Issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{openIssues}</div>
            <p className="text-sm text-gray-600">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{inProgressIssues}</div>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{doneIssues}</div>
            <p className="text-sm text-gray-600">Done</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Issues</CardTitle>
          {user?.role === 'manager' && (
            <Button onClick={() => setShowCreateIssue(true)}>
              Create Issue
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No issues yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">
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
                      <Badge className={getPriorityColor(issue.priority)}>
                        {getPriorityLabel(issue.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(issue.status)}>
                        {formatStatus(issue.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{issue.assignee?.name || '-'}</TableCell>
                    <TableCell className="font-semibold">{issue.total_hours || 0}h</TableCell>
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
                            variant="ghost"
                            size="sm"
                            onClick={() => openAssignDialog(issue)}
                            title="Assign"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
