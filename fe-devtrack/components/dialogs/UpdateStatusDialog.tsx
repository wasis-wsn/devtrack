'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UpdateStatusDialogProps {
  issue: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateStatusDialog({
  issue,
  isOpen,
  onClose,
  onSuccess,
}: UpdateStatusDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStatusChange = async (newStatus: string) => {
    setError('');
    setLoading(true);

    try {
      await api.updateIssue(issue.id, { status: newStatus });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setError('');
      onClose();
    }
  };

  const statusOptions = [
    { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Issue Status</DialogTitle>
          <DialogDescription>
            Change status for: {issue.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Current Status:</p>
            <Badge className={statusOptions.find(s => s.value === issue.status)?.color}>
              {statusOptions.find(s => s.value === issue.status)?.label}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Change to:</p>
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={loading || issue.status === status.value}
                  variant={issue.status === status.value ? 'secondary' : 'outline'}
                  className="flex-1"
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
