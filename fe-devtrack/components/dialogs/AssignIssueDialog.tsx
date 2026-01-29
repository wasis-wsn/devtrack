'use client';

import { useEffect, useState } from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssignIssueDialogProps {
  issue: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignIssueDialog({
  issue,
  isOpen,
  onClose,
  onSuccess,
}: AssignIssueDialogProps) {
  const [loading, setLoading] = useState(false);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadEngineers();
      if (issue.assigned_to) {
        setSelectedEngineer(String(issue.assigned_to));
      }
    }
  }, [isOpen, issue]);

  const loadEngineers = async () => {
    try {
      const data = await api.getEngineers();
      setEngineers(data);
    } catch (err) {
      console.error('Failed to load engineers', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedEngineer) {
      setError('Please select an engineer');
      return;
    }

    setLoading(true);
    try {
      await api.updateIssue(issue.id, {
        assigned_to: Number(selectedEngineer),
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to assign issue');
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Assign Issue</DialogTitle>
          <DialogDescription>
            Assign this issue to an engineer: {issue.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="engineer">Engineer *</Label>
            <Select
              value={selectedEngineer}
              onValueChange={setSelectedEngineer}
              disabled={loading}
            >
              <SelectTrigger id="engineer">
                <SelectValue placeholder="Select an engineer" />
              </SelectTrigger>
              <SelectContent>
                {engineers.map((engineer) => (
                  <SelectItem key={engineer.id} value={String(engineer.id)}>
                    {engineer.name} ({engineer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
