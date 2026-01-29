<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Reports",
 *     description="Report endpoints"
 * )
 */
class ReportController extends Controller
{
    /**
     * Get project report
     * 
     * @OA\Get(
     *     path="/api/projects/{id}/report",
     *     operationId="getProjectReport",
     *     tags={"Reports"},
     *     summary="Get project report",
     *     description="Get report with all issues and work logs for a project",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project report",
     *         @OA\JsonContent(
     *             @OA\Property(property="project", type="object"),
     *             @OA\Property(property="issues", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="title", type="string"),
     *                     @OA\Property(property="type", type="string"),
     *                     @OA\Property(property="status", type="string"),
     *                     @OA\Property(property="priority", type="integer"),
     *                     @OA\Property(property="assigned_engineer", type="object"),
     *                     @OA\Property(property="total_working_hours", type="number")
     *                 )
     *             ),
     *             @OA\Property(property="total_hours", type="number")
     *         )
     *     )
     * )
     */
    public function projectReport(Request $request, Project $project)
    {
        $user = $request->user();

        // Check authorization: managers can see all reports, engineers only for their assigned issues
        if ($user->role === 'engineer' && !$project->issues()->where('assigned_to', $user->id)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $issues = $project->issues()->with('assignee', 'workLogs')->get();

        $reportData = [
            'project' => $project->load('manager'),
            'issues' => $issues->map(function ($issue) {
                return [
                    'id' => $issue->id,
                    'title' => $issue->title,
                    'description' => $issue->description,
                    'type' => $issue->type,
                    'status' => $issue->status,
                    'priority' => $issue->priority,
                    'assigned_engineer' => $issue->assignee,
                    'total_working_hours' => $issue->getTotalWorkingHours(),
                    'work_logs' => $issue->workLogs->map(function ($log) {
                        return [
                            'id' => $log->id,
                            'hours' => $log->hours,
                            'description' => $log->description,
                            'logged_by' => $log->user->name,
                            'logged_at' => $log->logged_at,
                        ];
                    }),
                ];
            }),
            'total_hours' => $issues->reduce(function ($carry, $issue) {
                return $carry + $issue->getTotalWorkingHours();
            }, 0),
        ];

        return response()->json($reportData);
    }
}
