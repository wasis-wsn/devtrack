'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatStatus, formatType, getStatusColor, getTypeColor } from '@/lib/formatters';

export default function ReportsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [report, setReport] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const data = await api.getProjects();
      setProjects(data);
    };
    load();
  }, []);

  const loadReport = async (projectId: string) => {
    setSelectedProject(projectId);
    const data = await api.getProjectReport(Number(projectId));
    setReport(data);
  };

  const totalIssues = report?.issues?.length || 0;
  const totalHours = report?.issues?.reduce((sum: number, issue: any) => {
    const hours = parseFloat(issue.total_working_hours) || 0;
    return sum + hours;
  }, 0) || 0;
  const openIssues = report?.issues?.filter((i: any) => i.status === 'open').length || 0;
  const inProgressIssues = report?.issues?.filter((i: any) => i.status === 'in_progress').length || 0;
  const doneIssues = report?.issues?.filter((i: any) => i.status === 'done').length || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Report</h2>

      <Card>
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={loadReport}>
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
        </CardContent>
      </Card>

      {report && (
        <>
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalIssues}</div>
                <p className="text-sm text-gray-600">Total Issues</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</div>
                <p className="text-sm text-gray-600">Total Hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-500">{openIssues}</div>
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
            <CardHeader>
              <CardTitle>Issues Details</CardTitle>
            </CardHeader>
            <CardContent>
              {report.issues && report.issues.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Assigned Engineer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.issues.map((issue: any) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.title}</TableCell>
                        <TableCell>{issue.assignee?.name || 'Unassigned'}</TableCell>
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
                        <TableCell className="font-semibold">
                          {parseFloat(issue.total_working_hours || 0).toFixed(1)}h
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No issues found</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
