'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatStatus, formatType, getPriorityLabel, getPriorityColor, getStatusColor, getTypeColor, formatDateTime } from '@/lib/formatters';
import UpdateStatusDialog from '@/components/dialogs/UpdateStatusDialog';
import LogWorkDialog from '@/components/dialogs/LogWorkDialog';
import { ArrowLeft } from 'lucide-react';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showLogWork, setShowLogWork] = useState(false);

  useEffect(() => {
    loadIssue();
  }, [params.id]);

  const loadIssue = async () => {
    try {
      const data = await api.getIssue(Number(params.id));
      setIssue(data);
    } catch (err: any) {
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        router.push('/dashboard/issues');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    setShowUpdateStatus(false);
    loadIssue();
  };

  const handleLogWorkSuccess = () => {
    setShowLogWork(false);
    loadIssue();
  };

  const isAssigned = user?.id === issue?.assigned_to;
  const canModify = user?.role === 'engineer' && isAssigned;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Issue not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{issue.title}</h1>
          <p className="text-gray-600 mt-1">
            {issue.project?.name}
          </p>
        </div>
        <Badge className={getStatusColor(issue.status)}>
          {formatStatus(issue.status)}
        </Badge>
      </div>

      {showUpdateStatus && (
        <UpdateStatusDialog
          issue={issue}
          isOpen={showUpdateStatus}
          onClose={() => setShowUpdateStatus(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showLogWork && (
        <LogWorkDialog
          issueId={issue.id}
          issueTitle={issue.title}
          isOpen={showLogWork}
          onClose={() => setShowLogWork(false)}
          onSuccess={handleLogWorkSuccess}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">
            {issue.description || 'No description provided'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold w-32">Type:</span>
            <Badge className={getTypeColor(issue.type)}>
              {formatType(issue.type)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold w-32">Priority:</span>
            <Badge className={getPriorityColor(issue.priority)}>
              {getPriorityLabel(issue.priority)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold w-32">Assigned to:</span>
            <span>{issue.assignee?.name || 'Unassigned'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold w-32">Total Hours:</span>
            <span className="font-bold text-blue-600">{issue.total_hours || 0} hours</span>
          </div>
        </CardContent>
      </Card>

      {canModify && (
        <div className="flex gap-3">
          <Button onClick={() => setShowUpdateStatus(true)} variant="default">
            Update Status
          </Button>
          <Button onClick={() => setShowLogWork(true)} variant="outline">
            Log Work
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Work Logs ({issue.work_logs?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!issue.work_logs || issue.work_logs.length === 0 ? (
            <p className="text-gray-500">No work logs yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hours</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Logged By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issue.work_logs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-semibold">{log.hours}h</TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{formatDateTime(log.logged_at)}</TableCell>
                    <TableCell>{log.user?.name}</TableCell>
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
